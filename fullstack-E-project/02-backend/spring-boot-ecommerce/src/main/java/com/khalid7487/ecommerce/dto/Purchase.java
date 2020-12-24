package com.khalid7487.ecommerce.dto;

import com.khalid7487.ecommerce.entity.Address;
import com.khalid7487.ecommerce.entity.Customer;
import com.khalid7487.ecommerce.entity.Order;
import com.khalid7487.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;

    private Address shippingAddress;

    private Address billingAddress;

    private Order order;

    private Set<OrderItem> orderItems;
}
