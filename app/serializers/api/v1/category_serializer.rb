class Api::V1::CategorySerializer < ActiveModel::Serializer
  attributes :id, :name, :image_name, :book_details

  def book_details
    object.books.map do |book|
      {
        book_id: book.id,
        name: book.name,
        price: book.amount,
        overall_rating: book.overall_rating,
        image_name: format_image_name(book.image_name),
        author: {
          name: book.author.name
        },
        # Add other attributes you want to include for each book
      }
    end
  end

  def image_name
    object.image_name&.sub('public/uploads', '')
  end

  def format_image_name(image_name)
    image_name&.sub('public/uploads', '')
  end
end
