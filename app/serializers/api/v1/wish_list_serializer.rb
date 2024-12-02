class Api::V1::WishListSerializer < ActiveModel::Serializer
  attributes :book_details

  def book_details
    book = object.book
    {
      book_id: book.id,
      name: book.name,
      price: book.amount,
      overall_rating: book.overall_rating,
      author: {
        id: book.author.id,
        name: book.author.name
      }
    }
  end
end
