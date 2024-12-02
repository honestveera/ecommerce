module OrdersHelper
  # Company admin has to approve
  def send_rented_notification
    return unless @order.order_type == 'RENT'

    # Schedule notifications for days 10 through 15
    (10..15).each do |day|
      OrderNotificationJob.set(wait: day.days).perform_later(@order.id, day)
    end
  end
end
