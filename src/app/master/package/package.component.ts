import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../Service/global.service';


declare function onButtonClick111(onOpenHandler,onCloseHandler,onPaymentSuccessHandler,onPaymentFailureHandler): any;
// declare function onPaymentSuccessHandler(res): any;

@Component({
  selector: 'ngx-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss']
})
export class PackageComponent implements OnInit {

  constructor(
    private service: GlobalService,

  ) { }

 options = {
    "key": "pl_HWijM1eUqACDrH", 
    "amount": "100", 
    "currency": "INR",
    "name": "Acme Corp",
    "description": "Test Transaction",
    "image": "https://example.com/your_logo",
    "order_id": "", 
    "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
    "prefill": {
        "name": "Gaurav Kumar",
        "email": "gaurav.kumar@example.com",
        "contact": "9999999999"
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }
};

  ngOnInit(): void {
  }
  rzp1;
  async PackageButtonClick(Id)
  {
    this.options['handler'] = this.razorPaySuccessHandler.bind(this);

    this.rzp1 = new this.service.nativeWindow.Razorpay(this.options);
    this.rzp1.open();
    // let GetVal = [];
    // let obj = {
    //   p_Condition: ""
    // }
    // GetVal.push(obj);

    // let res = await this.service.GetDataAPIS('InstaMojoPaymentApi', 'Post', GetVal);
    // console.log('res',res);
    // if (res != null && res != undefined && res != "") {
    //   if (res.length != 0) {
    //   }
    // }
  // let res : any;
  //  let temp = await onButtonClick111(this.onOpenHandler(),this.onCloseHandler(),this.onPaymentSuccessHandler(res),this.onPaymentFailureHandler(res));
  //  //let Temp11 = await onPaymentSuccessHandler(res);
  //  console.log('Temp11',Temp11);
  //  console.log('Res',res);
   
    //     let objBody = [
    //   { 
    //     "allow_repeated_payments" : true,
    //     "amount" : 10,
    //     "buyer_name" : "Tarun",
    //     "purpose": "Test",
    //     "phone" : 9537345005,
    //     "send_email" : true,
    //     "send_sms" : true,
    //     "email" : "tarunsavani48@gmail.com"
    //   }
    // ]
    // let res = await this.service.GetDataAPISInstaMojo('https://imjo.in/EXNaR9', 'Post', objBody);
    // console.log('res',res);
    // if (!!res) {
    //   if (res.length > 0) {
  
    //   } else {
    //     this.service.AlertSuccess('error', "No Data Found..!!");
    //   }
    // } else {
    //   this.service.AlertSuccess('error', "No Data Found..!!");
    // }
  }

  public razorPaySuccessHandler(response) {
    console.log(response);
    alert('Payment Success');
  }

   onOpenHandler () {
    alert('Payments Modal is Opened');
  }

   onCloseHandler () {
    alert('Payments Modal is Closed');
  }

   onPaymentSuccessHandler (response) {
    alert('Payment Success');
    console.log('Payment Success Response', response);
  }

   onPaymentFailureHandler (response) {
    alert('Payment Failure');
    console.log('Payment Failure Response', response);
    return response;
  }

  
}
