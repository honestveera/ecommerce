class OrderNotificationJob < ApplicationJob
  queue_as :default

  def perform(order_id, day)
    order = Order.find(order_id)
    OrderMailer.order_placed_notification(order, day).deliver_now
  end
end
