import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../app.component';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AdminServicesService } from '../services/admin-services.service';
import { DatePipe } from '@angular/common';
import * as shortid from 'shortid';
import * as moment from 'moment';
import { WindowRef } from './WindowRef';

declare var $: any;

// var shortid = require('shortid');

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css', '../menu/menu.component.css']
})
export class CheckoutComponent implements OnInit {

  // tslint:disable-next-line:max-line-length
  constructor(public authService: AuthService, private title: Title, private router: Router, private getMenu: AdminServicesService, private datePipe: DatePipe, private winRef: WindowRef, private appComponent: AppComponent) {}
  // Razorpay variables
  rzp1: any;
  options: any;
  p_key = 'rzp_live_qNI6V5maLBak44';
  // p_key = 'rzp_test_w2CGfBqrpGcF5o';
  p_secret = 'lM0HT7rLLHAIguyJIFv0jQ8y';
  // p_secret = 'lM0HT7rLLHAIguyJIFv0jQ8y';

  kevv = 'kevv';

  addresses= [];
  userId: string;
  userEmail: string;
  fullName: string;
  userName: string;
  companyName: string;
  userMobile: number;
  orders: object;
  today_orders: object;

  today_date: string = null;
  day_one_date: string = null;
  day_two_date: string = null;
  day_three_date: string = null;
  day_four_date: string = null;
  day_five_date: string = null;
  day_six_date: string = null;

  today_per_portion_price: number;
  day_one_per_portion_price: number;
  day_two_per_portion_price: number;
  day_three_per_portion_price: number;
  day_four_per_portion_price: number;
  day_five_per_portion_price: number;
  day_six_per_portion_price: number;

  today_num_items: number;
  day_one_num_items: number;
  day_two_num_items: number;
  day_three_num_items: number;
  day_four_num_items: number;
  day_five_num_items: number;
  day_six_num_items: number;

  today_total_price = 0;
  day_one_total_price = 0;
  day_two_total_price = 0;
  day_three_total_price = 0;
  day_four_total_price = 0;
  day_five_total_price = 0;
  day_six_total_price = 0;

  today_menu = [];
  day_one_menu = [];
  day_two_menu = [];
  day_three_menu = [];
  day_four_menu = [];
  day_five_menu = [];
  day_six_menu = [];

  today_slot: string;
  day_one_slot: string;
  day_two_slot: string;
  day_three_slot: string;
  day_four_slot: string;
  day_five_slot: string;
  day_six_slot: string;

  slot_one = '12:00 PM - 12:45 PM';
  slot_two = '12:45 PM - 1:30 PM';
  slot_three = '1:30 PM - 2:15 PM';
  slot_four = '2:15 PM - 3:00 PM';

  delivery_fee = 0;
  total_price: number;
  total_to_pay: number;

  tab_one: object;
  tab_two: object;
  tab_three: object;

  // Tabs names
  tab_one_name: string;
  tab_two_name: string;
  tab_three_name: string;

  // Tabs time slots
  tab_one_time_slot: string;
  tab_two_time_slot: string;
  tab_three_time_slot: string;

  // Tabs base price
  tab_one_base_price: number;
  tab_two_base_price: number;
  tab_three_base_price: number;
  // Tabs total price
  tab_one_total_price = 0;
  tab_two_total_price = 0;
  tab_three_total_price = 0;

  // Tab num of times
  tab_one_times: number;
  tab_two_times: number;
  tab_three_times: number;


  selected_address: string;
  payment_method: string;
  deliveryInst = '';
  rewardPoints: number;
  fixedRewardPoints: number;

  basket_num: number;

  rewardPointsPermissions = false;
  redeemable = 0;
  discount = 0;
  deduct_points = 0;
  remainingPoints = 0;

  points_earned = 0;

  today_one = moment();
  dateForHeader: string;
  original_address: string;
  placeholder_address: string;
  letter_price = 0;
  letter_added = 'false';
  one_address= false;
  showDiscount = false;

  tab_one_change_status = false;
  tab_two_change_status = false;
  tab_three_change_status = false;
  day_one_change_status = false;
  day_two_change_status = false;
  day_three_change_status = false;
  day_four_change_status = false;
  day_five_change_status = false;

  schSlot= 'def';
  schTimes: any;

  date_and_item_array = [];

  ngOnInit() {
    // Getting orders
    this.title.setTitle('Fysu - Checkout');
    this.dateForHeader = this.datePipe.transform(this.today_one, 'EEE, MMM d');
    // tslint:disable-next-line:radix
    this.basket_num = parseInt(localStorage.getItem('basket_number'));
    if (this.basket_num === undefined || this.basket_num === null || this.basket_num === 0 || isNaN(this.basket_num) === true) {
      // redirect to menu
      this.router.navigate(['/menu']);
    }
    const user = this.authService.getUserFromLocal();
    const user_parsed = JSON.parse(user);
    this.userEmail = user_parsed.email;
    this.fullName = user_parsed.name;
    this.companyName = user_parsed.company_name;
    this.userMobile = user_parsed.mobile;
    this.userId = user_parsed.id;
    const fLength = this.fullName.split(' ');
    if (fLength.length > 1) {
      this.userName = this.fullName.split(' ').slice(0, -(this.fullName.split(' ').length - 1)).join(' ');
    }else {
      this.userName = this.fullName;
    }
    // Getting user reward points
    this.authService.getUserRewards(this.userId).subscribe(res => {
      if (res.success) {
        this.rewardPoints = res.msg;
        this.remainingPoints = res.msg;
        this.fixedRewardPoints = res.msg;
        // Conditions
        if (this.rewardPoints >= 100) {
          this.rewardPointsPermissions = true;
          if (this.rewardPoints <= 190) {
            // Number of redeemable points are 100
            this.redeemable = 100;
            // Cost deductable
            this.discount = 10;
          }
          if (this.rewardPoints > 191 && this.rewardPoints < 360) {
            // Number of redeemable points are 190
            this.redeemable = 190;
            // Cost deductable
            this.discount = 20;
          }
          if (this.rewardPoints >= 360) {
            // Number of redeemable points
            this.redeemable = 360;
            // Cost deductable
            this.discount = 40;
          }
        }
      }else {
        this.rewardPoints = 0;
        this.fixedRewardPoints = 0;
        // Can't do anything
      }
    });

    // Get if letter is added from localstorage
    this.letter_added = localStorage.getItem('letter_added');
    if (this.letter_added === 'true') {
      this.letter_price = 5;
    }
    const s_orders = localStorage.getItem('all_orders');
    this.orders = JSON.parse(s_orders);
    const to_orders = localStorage.getItem('today_orders');
    this.today_orders = JSON.parse(to_orders);
    if (this.today_orders != null) {
      this.tab_one = this.today_orders['tab_one'];
      this.tab_two = this.today_orders['tab_two'];
      this.tab_three = this.today_orders['tab_three'];

      if (this.tab_one != null) {
        this.tab_one_base_price = this.today_orders['tab_one'].base_price;
        this.tab_one_total_price = this.today_orders['tab_one'].total_price;
        this.tab_one_name = this.today_orders['tab_one'].name;
        this.tab_one_times = this.today_orders['tab_one'].num_of_items;
        this.tab_one_time_slot = this.getSlotValue(this.today_orders['tab_one'].time_slot);
      }


      if (this.tab_two != null) {
        this.tab_two_base_price = this.today_orders['tab_two'].base_price;
        this.tab_two_total_price = this.today_orders['tab_two'].total_price;
        this.tab_two_name = this.today_orders['tab_two'].name;
        this.tab_two_times = this.today_orders['tab_two'].num_of_items;
        this.tab_two_time_slot = this.getSlotValue(this.today_orders['tab_two'].time_slot);
      }

      if (this.tab_three != null) {
        this.tab_three_base_price = this.today_orders['tab_three'].base_price;
        this.tab_three_total_price = this.today_orders['tab_three'].total_price;
        this.tab_three_name = this.today_orders['tab_three'].name;
        this.tab_three_times = this.today_orders['tab_three'].num_of_items;
        this.tab_three_time_slot = this.getSlotValue(this.today_orders['tab_three'].time_slot);
      }
    }
    // Get addresses
    this.authService.getUserAddressses(this.userId).subscribe(res => {
      if (res.success) {
        this.addresses = res.msg[0].address;
        if (this.addresses.length > 0) {
          console.log('one address');
        }else {
          const addressd = {
            user_id: this.userId,
            address: localStorage.getItem('home_address')
          };
          this.authService.saveAddress(addressd).subscribe(rees => {
            if (rees.success) {
              // Address saved
              // alert('saved');
            }else {
              // alert('nope');
            }
          });
          this.addresses.push(localStorage.getItem('home_address'));
        }
      }
    });

    if (this.orders != null) {
      if (this.orders['day_one'] != null) {
        this.day_one_date = this.orders['day_one'].date;
        this.day_one_date = this.datePipe.transform(this.day_one_date, 'EEE, MMM d');
        this.day_one_per_portion_price = this.orders['day_one'].perPortionPrice;
        this.day_one_total_price = this.orders['day_one'].totalPrice;
        this.day_one_num_items = this.orders['day_one'].numOfTimes;
        this.day_one_menu = this.orders['day_one'].menu;
        // Time slots
        switch (this.orders['day_one'].timeSlot) {
          case 'slot_one':
            this.day_one_slot = this.slot_one;
            break;
          case 'slot_two':
            this.day_one_slot = this.slot_two;
            break;
          case 'slot_three':
            this.day_one_slot = this.slot_three;
            break;
          case 'slot_four':
            this.day_one_slot = this.slot_four;
            break;
          default:
            break;
        }
      }else {
        this.day_one_menu = null;
      }
      if (this.orders['day_two'] != null) {
        this.day_two_date = this.orders['day_two'].date;
        this.day_two_date = this.datePipe.transform(this.day_two_date, 'EEE, MMM d');
        this.day_two_per_portion_price = this.orders['day_two'].perPortionPrice;
        this.day_two_total_price = this.orders['day_two'].totalPrice;
        this.day_two_num_items = this.orders['day_two'].numOfTimes;
        this.day_two_menu = this.orders['day_two'].menu;

        // Time slots
        switch (this.orders['day_two'].timeSlot) {
          case 'slot_one':
            this.day_two_slot = this.slot_one;
            break;
          case 'slot_two':
            this.day_two_slot = this.slot_two;
            break;
          case 'slot_three':
            this.day_two_slot = this.slot_three;
            break;
          case 'slot_four':
            this.day_two_slot = this.slot_four;
            break;
          default:
            break;
        }

      }else {
        this.day_two_menu = null;
      }

      if (this.orders['day_three'] != null) {
        this.day_three_date = this.orders['day_three'].date;
        this.day_three_date = this.datePipe.transform(this.day_three_date, 'EEE, MMM d');
        this.day_three_per_portion_price = this.orders['day_three'].perPortionPrice;
        this.day_three_total_price = this.orders['day_three'].totalPrice;
        this.day_three_num_items = this.orders['day_three'].numOfTimes;
        this.day_three_menu = this.orders['day_three'].menu;

        // Time slots
        switch (this.orders['day_three'].timeSlot) {
          case 'slot_one':
            this.day_three_slot = this.slot_one;
            break;
          case 'slot_two':
            this.day_three_slot = this.slot_two;
            break;
          case 'slot_three':
            this.day_three_slot = this.slot_three;
            break;
          case 'slot_four':
            this.day_three_slot = this.slot_four;
            break;
          default:
            break;
        }

      }else {
        this.day_three_menu = null;
      }

      if (this.orders['day_four'] != null) {
        this.day_four_date = this.orders['day_four'].date;
        this.day_four_date = this.datePipe.transform(this.day_four_date, 'EEE, MMM d');
        this.day_four_per_portion_price = this.orders['day_four'].perPortionPrice;
        this.day_four_total_price = this.orders['day_four'].totalPrice;
        this.day_four_num_items = this.orders['day_four'].numOfTimes;
        this.day_four_menu = this.orders['day_four'].menu;
        // Time slots
        switch (this.orders['day_four'].timeSlot) {
          case 'slot_one':
            this.day_four_slot = this.slot_one;
            break;
          case 'slot_two':
            this.day_four_slot = this.slot_two;
            break;
          case 'slot_three':
            this.day_four_slot = this.slot_three;
            break;
          case 'slot_four':
            this.day_four_slot = this.slot_four;
            break;
          default:
            break;
        }
      }else {
        this.day_four_menu = null;
      }
      if (this.orders['day_five'] != null) {
        this.day_five_date = this.orders['day_five'].date;
        this.day_five_date = this.datePipe.transform(this.day_five_date, 'EEE, MMM d');
        this.day_five_per_portion_price = this.orders['day_five'].perPortionPrice;
        this.day_five_total_price = this.orders['day_five'].totalPrice;
        this.day_five_num_items = this.orders['day_five'].numOfTimes;
        this.day_five_menu = this.orders['day_five'].menu;
        // Time slots
        switch (this.orders['day_five'].timeSlot) {
          case 'slot_one':
            this.day_five_slot = this.slot_one;
            break;
          case 'slot_two':
            this.day_five_slot = this.slot_two;
            break;
          case 'slot_three':
            this.day_five_slot = this.slot_three;
            break;
          case 'slot_four':
            this.day_five_slot = this.slot_four;
            break;
          default:
            break;
        }
      }else {
        this.day_five_menu = null;
      }
    }
    // Get location from local storage
    // tslint:disable-next-line:max-line-length
    this.total_price = this.delivery_fee + this.today_total_price + this.day_one_total_price + this.day_two_total_price + this.day_three_total_price + this.day_four_total_price + this.day_five_total_price + this.tab_one_total_price + this.tab_two_total_price + this.tab_three_total_price + this.letter_price;

    this.total_to_pay = this.total_price;
    const rounded_num = Math.round(this.total_price / 10);
    this.points_earned = rounded_num;
  }
  redeemClicked() {
    this.showDiscount = true;
    this.remainingPoints = this.rewardPoints - this.redeemable;
    this.total_to_pay = this.total_price - this.discount;
    this.rewardPoints = this.remainingPoints;
    $('#redeem-btn').css({'background-color': '#9a9a9a'});
    $('#redeem-btn').prop('disabled', true);
  }
  addRewardPoints() {
    this.deduct_points = +this.remainingPoints + +this.points_earned;
    this.getMenu.repRewards(this.userEmail, this.deduct_points).subscribe(res => {
      if (res.success) {
      }
    });
  }
  onLogoutClick() {
    this.authService.logout();
    this.router.navigate(['/home']);
    return false;
  }
  addressChecked(event) {
    this.selected_address = event.target.value;
    $('.err').html('');
  }
  paymentMethod(event) {
    this.payment_method = event.target.value;
    $('.err').html('');
  }

  public geoLocate() {
    let location, lat, long, address;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        location = position.coords;
        lat = position.coords.latitude;
        long = position.coords.longitude;
        if (location === undefined || location === null) {
        } else {
          this.authService.getLocation(lat, long).subscribe(res => {
            address = res.results[0].formatted_address;
            this.placeholder_address = address;
            // const addres = {
            //   user_id: this.userId,
            //   address: address
            // };
            // this.authService.saveAddress(addres).subscribe(rres => {
            //   if (rres.success) {
            //     // Address saved
            //     console.log(rres);
            //   } else {
            //     if (rres.msg = 'exists') {
            //     } else {
            //     }
            //   }
            // });
          });
        }
      });
    }
  }


  placeOrder() {
    // Check for address
    if (this.selected_address === null || this.selected_address === undefined) {
      // Show Error
      $('.err').html('Please select an address');
    }else {
      if (this.selected_address === '' || this.selected_address.length === 0) {
        $('.err').html('Your address is empty, please edit the address');
      }else {
        const delivery_address = this.selected_address;
        // Check for payment type
        if (this.payment_method === null || this.payment_method === undefined) {
          // Show error
          $('.err').html('Please select a payment method');
        }else {
          let pay_method = this.payment_method;
          if (this.payment_method === 'Cash On Delivery') {
            pay_method = 'Cash On Delivery';
          }
          // Generate Order Id
          // delivery notes
          let delivery_notes;
          if (this.deliveryInst != null) {
            delivery_notes = this.deliveryInst;
          }else {
            delivery_notes = '-';
          }
          // Order id
          const order_id = shortid.generate();
          // Cumulative of today's and all schduled orders
          const cum_orders = {
            today: this.today_orders,
            // next days orders
            next_days: this.orders
          };
          // Whole order in one place
          const main_order = {
            user_id: this.userId,
            order_id: order_id,
            delivery_notes: delivery_notes,
            order_time: moment().format('llll'),
            delivery_address : delivery_address,
            payment_method: pay_method,
            order: cum_orders,
            total_price: this.total_price
          };
          // Send order to backend
          const json = {'order_dets': main_order};
          if (this.payment_method !== 'Cash On Delivery') {
            if (this.payment_method === 'Wallet') {
              this.options = {
                'key': this.p_key,
                'amount': this.total_to_pay * 100, // 2000 paise = INR 20
                'name': 'Fysu',
                'description': 'Purchase Description',
                'image': '../../assets/logo/logo_black.png',
                'handler':  (response) => {
                  this.postOrder(response, json, order_id);
              },
                'prefill': {
                    'name': this.userName,
                    'email': this.userEmail,
                    'contact': this.userMobile,
                    'method': this.payment_method
                },
                'notes': {
                    'address': this.deliveryInst
                },
                'theme': {
                    'color': '#F37254'
                }
              };
            }else {
              this.options = {
                'key': this.p_key,
                'amount': this.total_to_pay * 100, // 2000 paise = INR 20
                'name': 'Fysu',
                'description': 'Purchase Description',
                'image': '../../assets/logo/logo_black.png',
                'handler': (response) => {
                    this.postOrder(response, json, order_id);
                },
                'prefill': {
                    'name': this.userName,
                    'email': this.userEmail,
                    'contact': this.userMobile
                },
                'notes': {
                    'address': this.deliveryInst
                },
                'theme': {
                    'color': '#F37254'
                }
              };
            }
          this.rzp1 = new this.winRef.nativeWindow.Razorpay(this.options);
          this.rzp1.open();
          }else {
            this.postOrder('Cash On Delivery', json, order_id);
          }
        }
      }
    }
  }

  getSlotValue(slot) {
    switch (slot) {
      case 'slot_one':
        return '12:00 PM - 12:45 PM';
      case 'slot_two':
        return '12:45 PM - 1:30 PM';
      case 'slot_three':
        return '1:30 PM - 2:15 PM';
      case 'slot_four':
        return '2:15 PM - 3:00 PM';
      default:
        break;
    }
  }
  postOrder(resp, json, order_id) {
    this.addRewardPoints();
    this.authService.postOrder(json).subscribe(res => {
      if (res.success) {
        const dIjson = { dateItem: this.date_and_item_array };
          this.addRewardPoints();
          localStorage.setItem('order_id', order_id);
          localStorage.removeItem('all_orders');
          localStorage.removeItem('today_orders');
          localStorage.removeItem('basket_number');
          this.basket_num = 0;
          this.appComponent.basket_num = 0;
          if (localStorage.getItem('order_id') !== null && localStorage.getItem('order_id') !== undefined) {
            this.router.navigate(['/thanks']);
          }else {
            setTimeout(() => {
              this.router.navigate(['/thanks']);
            }, 200);
          }
      }else {
        $('.err').html('Something went wrong. please try again later');
      }
    });
  }
  editAddress(i, address) {
    this.original_address = address;
    this.placeholder_address = address;
    $('.db').css({'display': 'flex'});
  }
  updateAddress() {
    const addresses = {
      user_id: this.userId,
      original : this.original_address,
      edited : this.placeholder_address
    };
    this.authService.updateAddress(addresses).subscribe(res => {
      if (res.success) {
        window.location.reload();
      }else {
        console.log(res.msg);
      }
    });
  }
  closeUpAddress() {
    $('.db').css({'display': 'none'});
  }
  removeDate(day) {
    switch (day) {

      case 'tab_one':
        // Remove tab_one from orders
        this.today_orders['tab_one'] = null;
        this.tab_one = null;
        // Update from localstorage
        localStorage.setItem('today_orders', JSON.stringify(this.today_orders));
        // Minus the cost from total
        this.total_price = this.total_price - this.tab_one_total_price;
        this.total_to_pay = this.total_to_pay - this.tab_one_total_price;
        // Update earned rewards
        const rounded_num = Math.round(this.total_price / 10);
        this.points_earned = rounded_num;
        break;
      case 'tab_two':
        // Remove tab_one from orders
        this.today_orders['tab_two'] = null;
        this.tab_two = null;
        // Update from localstorage
        localStorage.setItem('today_orders', JSON.stringify(this.today_orders));
        // Minus the cost from total
        this.total_price = this.total_price - this.tab_two_total_price;
        this.total_to_pay = this.total_to_pay - this.tab_two_total_price;
         // Update earned rewards
         const rounded_num1 = Math.round(this.total_price / 10);
         this.points_earned = rounded_num1;
        break;

      case 'tab_three':
        // Remove tab_one from orders
        this.today_orders['tab_three'] = null;
        this.tab_three = null;
        // Update from localstorage
        localStorage.setItem('today_orders', JSON.stringify(this.today_orders));
        // Minus the cost from total
        this.total_price = this.total_price - this.tab_three_total_price;
        this.total_to_pay = this.total_to_pay - this.tab_three_total_price;
        const rounded_num2 = Math.round(this.total_price / 10);
        this.points_earned = rounded_num2;
        break;

      case 'day_one':
        // Remove day one from orders
        this.orders['day_one'] = null;
        this.day_one_date = null;
        // Update LocalStorage
        localStorage.setItem('all_orders', JSON.stringify(this.orders));
        // Minus the cost from total
        this.total_price = this.total_price - this.day_one_total_price;
        this.total_to_pay = this.total_to_pay - this.day_one_total_price;
        const rounded_num3 = Math.round(this.total_price / 10);
        this.points_earned = rounded_num3;
        break;

      case 'day_two':
        // Remove day one from orders
        this.orders['day_two'] = null;
        this.day_two_date = null;
        // Update LocalStorage
        localStorage.setItem('all_orders', JSON.stringify(this.orders));
        // Minus the cost from total
        this.total_price = this.total_price - this.day_two_total_price;
        this.total_to_pay = this.total_to_pay - this.day_two_total_price;
        const rounded_num4 = Math.round(this.total_price / 10);
        this.points_earned = rounded_num4;
        break;

      case 'day_three':
        // Remove day one from orders
        this.orders['day_three'] = null;
        this.day_three_date = null;
        // Update LocalStorage
        localStorage.setItem('all_orders', JSON.stringify(this.orders));
        // Minus the cost from total
        this.total_price = this.total_price - this.day_three_total_price;
        this.total_to_pay = this.total_to_pay - this.day_three_total_price;
        const rounded_num5 = Math.round(this.total_price / 10);
        this.points_earned = rounded_num5;
        break;

      case 'day_four':
        // Remove day one from orders
        this.orders['day_four'] = null;
        this.day_four_date = null;
        // Update LocalStorage
        localStorage.setItem('all_orders', JSON.stringify(this.orders));
        // Minus the cost from total
        this.total_price = this.total_price - this.day_four_total_price;
        this.total_to_pay = this.total_to_pay - this.day_four_total_price;
        const rounded_num6 = Math.round(this.total_price / 10);
        this.points_earned = rounded_num6;
        break;

      case 'day_five':
        // Remove day one from orders
        this.orders['day_five'] = null;
        this.day_five_date = null;
        // Update LocalStorage
        localStorage.setItem('all_orders', JSON.stringify(this.orders));
        // Minus the cost from total
        this.total_price = this.total_price - this.day_five_total_price;
        this.total_to_pay = this.total_to_pay - this.day_five_total_price;
        const rounded_num7 = Math.round(this.total_price / 10);
        this.points_earned = rounded_num7;
        break;

      default:
        break;
    }
    if (this.total_price === 0) {
      this.router.navigate(['/menu']);
    }
  }
  changeDets(order_tab) {
    switch (order_tab) {
      case 'tab_one':
        this.tab_one_change_status = true;
        this.tab_two_change_status = false;
        this.tab_three_change_status = false;
        this.day_one_change_status = false;
        this.day_two_change_status = false;
        this.day_three_change_status = false;
        this.day_four_change_status = false;
        this.day_five_change_status = false;

        break;
      case 'tab_two':
        this.tab_one_change_status = false;
        this.tab_two_change_status = true;
        this.tab_three_change_status = false;
        this.day_one_change_status = false;
        this.day_two_change_status = false;
        this.day_three_change_status = false;
        this.day_four_change_status = false;
        this.day_five_change_status = false;

        break;
      case 'tab_three':
        this.tab_one_change_status = false;
        this.tab_two_change_status = false;
        this.tab_three_change_status = true;
        this.day_one_change_status = false;
        this.day_two_change_status = false;
        this.day_three_change_status = false;
        this.day_four_change_status = false;
        this.day_five_change_status = false;

        break;
      case 'day_one':
        this.tab_one_change_status = false;
        this.tab_two_change_status = false;
        this.tab_three_change_status = false;
        this.day_one_change_status = true;
        this.day_two_change_status = false;
        this.day_three_change_status = false;
        this.day_four_change_status = false;
        this.day_five_change_status = false;
        // Now
        break;
      case 'day_two':
        // $('.today-menu-back').css('display','flex');
        this.tab_one_change_status = false;
        this.tab_two_change_status = false;
        this.tab_three_change_status = false;
        this.day_one_change_status = false;
        this.day_two_change_status = true;
        this.day_three_change_status = false;
        this.day_four_change_status = false;
        this.day_five_change_status = false;

        break;
      case 'day_three':
        this.tab_one_change_status = false;
        this.tab_two_change_status = false;
        this.tab_three_change_status = false;
        this.day_one_change_status = false;
        this.day_two_change_status = false;
        this.day_three_change_status = true;
        this.day_four_change_status = false;
        this.day_five_change_status = false;

        break;
      case 'day_four':
        this.tab_one_change_status = false;
        this.tab_two_change_status = false;
        this.tab_three_change_status = false;
        this.day_one_change_status = false;
        this.day_two_change_status = false;
        this.day_three_change_status = false;
        this.day_four_change_status = true;
        this.day_five_change_status = false;
        break;
      case 'day_five':
        this.tab_one_change_status = false;
        this.tab_two_change_status = false;
        this.tab_three_change_status = false;
        this.day_one_change_status = false;
        this.day_two_change_status = false;
        this.day_three_change_status = false;
        this.day_four_change_status = false;
        this.day_five_change_status = true;
        break;

      default:
        break;
    }
    $('.today-menu-back').css('display', 'flex');
  }
  tdClose() {
    $('.today-menu-back').hide();
  }
  addTodayCartClicked() {
    if (this.schSlot !== 'def') {
      switch (true) {
        case this.tab_one_change_status:
          this.today_orders['tab_one'].time_slot = this.schSlot;
          this.tab_one_time_slot = this.getSlotValue(this.schSlot);
          break;
        case this.tab_two_change_status:
          this.today_orders['tab_two'].time_slot = this.schSlot;
          this.tab_two_time_slot = this.getSlotValue(this.schSlot);
          break;
        case this.tab_three_change_status:
          this.today_orders['tab_three'].time_slot = this.schSlot;
          this.tab_three_time_slot = this.getSlotValue(this.schSlot);
          break;
        case this.day_one_change_status:
          if (this.orders['day_one'] != null) {
            // Time slots
            switch (this.schSlot) {
              case 'slot_one':
                this.day_one_slot = this.slot_one;
                break;
              case 'slot_two':
                this.day_one_slot = this.slot_two;
                break;
              case 'slot_three':
                this.day_one_slot = this.slot_three;
                break;
              default:
                break;
            }
          }
          this.orders['day_one'].timeSlot = this.schSlot;
          break;
        case this.day_two_change_status:
            if (this.orders['day_two'] != null) {
              // Time slots
              switch (this.schSlot) {
                case 'slot_one':
                  this.day_two_slot = this.slot_one;
                  break;
                case 'slot_two':
                  this.day_two_slot = this.slot_two;
                  break;
                case 'slot_three':
                  this.day_two_slot = this.slot_three;
                  break;
                default:
                  break;
              }
            }
          break;
        case this.day_three_change_status:
        if (this.orders['day_three'] != null) {
          // Time slots
          switch (this.schSlot) {
            case 'slot_one':
              this.day_three_slot = this.slot_one;
              break;
            case 'slot_two':
              this.day_three_slot = this.slot_two;
              break;
            case 'slot_three':
              this.day_three_slot = this.slot_three;
              break;
            default:
              break;
          }
        }
          break;
        case this.day_four_change_status:
          if (this.orders['day_four'] != null) {
            // Time slots
            switch (this.schSlot) {
              case 'slot_one':
                this.day_four_slot = this.slot_one;
                break;
              case 'slot_two':
                this.day_four_slot = this.slot_two;
                break;
              case 'slot_three':
                this.day_four_slot = this.slot_three;
                break;
              default:
                break;
            }
          }
          break;
        case this.day_five_change_status:
          if (this.orders['day_five'] != null) {
            // Time slots
            switch (this.schSlot) {
              case 'slot_one':
                this.day_five_slot = this.slot_one;
                break;
              case 'slot_two':
                this.day_five_slot = this.slot_two;
                break;
              case 'slot_three':
                this.day_five_slot = this.slot_three;
                break;
              default:
                break;
            }
          }
          break;
        default:
          break;
      }
    }else {
      $('#t-menu-select-slot').css({'border-color': '#fa0000'});
      setTimeout(() => {
        $('#t-menu-select-slot').css({'border-color': '#666'});
      }, 2000);
    }
    $('.today-menu-back').hide();
  }
}
