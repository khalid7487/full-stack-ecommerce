import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { FormServiceService } from 'src/app/services/form-service.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  
  countries:  Country[] =[];

  constructor(private formBuilder: FormBuilder,
              private formService: FormServiceService,
              private cartService: CartService) { }

  ngOnInit(): void {
    
    this.reviewCartDetails();
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
                                  [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        lastName: new FormControl('',
                                  [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        email: new FormControl('',
                      [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
                             [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        city: new FormControl('',
                               [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
                                 [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',
                               [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        city: new FormControl('',
                              [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace ]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',
                        [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('',
                              [Validators.required]),
        nameOnCard: new FormControl('',
                                    [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('',
                                  [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',
                              [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      }),
    });

    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " +startMonth);

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived credit card months:" + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
    
    //populate credit card years

    this.formService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrived credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    //populate countries
    this.formService.getCountries().subscribe(
      data =>{
        console.log("Retrieved Countries:"+ JSON.stringify(data));
        this.countries = data;

      }
    );
  }

  reviewCartDetails() {

    //subscribe to cartService.totalQuantity
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    
    //subscribe to cartService.totalPrice
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }



  get firstName(){ return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName'); }
  get email(){ return this.checkoutFormGroup.get('customer.email'); }
  
  //get shipping Address validation
  get shippingAddressStreet(){
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity(){
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
 get shippingAddressState(){
   return this.checkoutFormGroup.get('shippingAddress.state');
 }
 get shippingAddressZipCode(){
   return this.checkoutFormGroup.get('shippingAddress.zipCode');
 }
 
 get shippingAddressCountry(){
   return this.checkoutFormGroup.get('shippingAddress.country');
 }
 //get billing Adress validation
 get billingAddressStreet(){
   return this.checkoutFormGroup.get('billingAddress.street');
 }
 get billingAddressCity(){
   return this.checkoutFormGroup.get('billingAddress.city');
 }
 get billingAddressState(){
   return this.checkoutFormGroup.get('billingAddress.state');
 }
 get billingAddressCountry(){
   return this.checkoutFormGroup.get('billingAddress.country');
 }
 get billingAddressZipCode(){
   return this.checkoutFormGroup.get('billingAddress.zipCode');
 }
 
 //Credit Card Validation
 get creditCardType(){
   return this.checkoutFormGroup.get('creditCard.cardType');
 }
 get creditCardnameOnCard(){
   return this.checkoutFormGroup.get('creditCard.nameOnCard');
 }
 get creditCardcardNumber(){
   return this.checkoutFormGroup.get('creditCard.cardNumber');
 }
 get creditCardsecurityCode(){
   return this.checkoutFormGroup.get('creditCard.securityCode');
 }


  copyShippingAdderssToBillingAddress(event){

    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress
                 .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
      //bug fix for states
      this.billingAddressStates = this.shippingAddressStates;           
    }else{
      this.checkoutFormGroup.controls.billingAddress.reset();

      //bug fix for states
      this.billingAddressStates = [];
    }
  }

  onSubmit(){
    console.log("Handling thw submit button");
    console.log(`Quantity b1 :${this.totalQuantity}` );
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log(this.checkoutFormGroup.get('customer').value.lastName);
    console.log(this.checkoutFormGroup.get('customer').value);

    console.log(this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log(this.checkoutFormGroup.get('shippingAddress').value.state.name);
  }

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if(selectedYear == currentYear){
      startMonth = new Date().getMonth() +1;
    }else{
      startMonth = 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country code: ${countryName}`);

    this.formService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName == 'shippingAddress'){
          this.shippingAddressStates = data;
        }else{
          this.billingAddressStates = data;
        }
        // select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }

}
