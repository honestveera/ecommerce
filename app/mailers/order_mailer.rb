class OrderMailer < ApplicationMailer
    default from: 'your_email@example.com'
  
    def order_status_notification(order)
      @order = order
      mail(to: [@order.user.email], subject: "Order Status is #{order.status}")
    end

    def order_placed_notification(order)
      @order = order
      mail(to: [@order.user.email], subject: 'Order Placed Notification')
    end

    def order_rented_notification(order, day)
      @order = order
      mail(to: [@order.user.email], subject: "Your Order Update: Day #{day}")
    end
end