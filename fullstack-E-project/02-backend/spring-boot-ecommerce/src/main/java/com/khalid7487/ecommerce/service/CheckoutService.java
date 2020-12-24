package com.khalid7487.ecommerce.service;

import com.khalid7487.ecommerce.dto.Purchase;
import com.khalid7487.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
