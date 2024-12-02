class Api::V1::CartSerializer < ActiveModel::Serializer
  attributes :id, :book_details, :total_price

  def book_details
    object.cart_items.map do |item|
      book = item.book
      {
        book_id: book.id,
        name: book.name,
        price: book.amount,  # Replace with the actual attribute for book price
        overall_rating: book.overall_rating,
        image_name: format_image_name(book.image_name),
        author: {
          id: book.author.id,
          name: book.author.name  # Replace with the actual attribute for author name
        },
        quantity: item.quantity
      }
    end
  end

  def image_name
    format_image_name(object.image_name)
  end

  def total_price
    object.cart_items.sum { |item| item.book.amount * item.quantity }
  end

  private

  def format_image_name(image_name)
    image_name&.sub('public/uploads', '')
  end
end