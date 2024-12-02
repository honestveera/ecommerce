class Order < ApplicationRecord
  validates :status,
            inclusion: { in: %w[ORDERED ORDER_ASSIGNED ORDER_PICKEDUP ORDER_SHIPPED ORDER_DELIVERED ORDER_CANCELLED
                                ORDER_RETURNED] }
  validates :order_type, inclusion: { in: %w[BUY RENT] }

  has_many :order_histories, dependent: :destroy
  belongs_to :user
  belongs_to :corporate
  belongs_to :book
  
  before_create :generate_order_number
  after_create :create_order_history
  after_update :update_book

  def create_order_history
    OrderHistory.create!(
      order_id: id,
      order_user_id: user_id,
      status: 'ORDERED' # Make sure 'params[:status]' is the correct source for the status value
    )
  end

  def self.retreive_orders(hash)
    if hash[:user_id] && hash[:corporate_id]
      Order.where(user_id: hash[:user_id], corporate_id: hash[:corporate_id])
    elsif hash[:user_id]
      Order.where(user_id: hash[:user_id])
    elsif hash[:corporate_id]
      Order.where(corporate_id: hash[:corporate_id])
    elsif hash[:status]
      Order.where(status: hash[:status])
    else
      Order.all
    end
  end

  def update_book
    return unless %w[ORDER_CANCELLED ORDER_RETURNED ORDER_DELIVERED ORDER_PICKEDUP ORDER_SHIPPED].include?(status)

    if status == 'ORDER_CANCELLED' || status == 'ORDER_RETURNED'
      book.update(availability: true)
    elsif %w[ORDER_DELIVERED ORDER_PICKEDUP ORDER_SHIPPED].include?(status)
      book.update(availability: false)
    end
  end

  def generate_order_number
    # Assuming you want a combination of timestamp and a random component
    timestamp = Time.now.strftime('%Y%m%d%H%M%S')
    random_part = SecureRandom.hex(3).upcase  # Adjust the length as needed

    self.order_number = "#{timestamp}-#{random_part}"
  end
end
