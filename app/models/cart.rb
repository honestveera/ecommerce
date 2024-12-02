class Cart < ApplicationRecord
  belongs_to :user
  has_many :cart_items, dependent: :destroy

  def total_price
    cart_items.sum { |item| item.book.amount * item.quantity }
  end
end
