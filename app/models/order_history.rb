class OrderHistory < ApplicationRecord
    belongs_to :order, class_name: 'Order', foreign_key: 'order_id'
    belongs_to :order_user, class_name: 'User', foreign_key: 'order_user_id'

    def delivery_partner
      return nil unless delivery_user_id

      User.find(delivery_user_id)
    end
  end
  