class Api::V1::OrderSerializer < ActiveModel::Serializer
  attributes :id, :order_type, :order_number, :delivery_partner, :date, :book_name, :user_name, :user_id, :book_id,
             :corporate_id, :delivery_address, :status, :amount, :order_histories

  def delivery_address
    object.corporate.address
  end

  def order_histories
    object.order_histories.map do |history|
      {
        date: history.created_at,
        status: history.status,
        delivery_partner: history.delivery_partner ? prepare_delivery_partner(history.delivery_partner) : nil
      }
    end
  end

  def prepare_delivery_partner(delivery_partner)
    {
      name: delivery_partner.first_name,
      email: delivery_partner.email
      # TODO: Mobile number need to add
    }
  end

  def delivery_partner
    return unless order_histories.last

    order_histories.last[:delivery_partner] ? order_histories.last[:delivery_partner][:name] : nil
  end

  def book_name
    object.book.name if object.book
  end

  def user_name
    "#{object.user.first_name} #{object.user.last_name}"
  end
end
