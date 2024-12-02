class  Api::V1::HomeController < ApplicationController
  def index
    @newly_added_books = Book.order(created_at: :desc).limit(10)
    @top_rated_books = Book.where('overall_rating > ?', 4).limit(10)

    render json: {
      newly_added_books: serialize_books(@newly_added_books),
      top_rated_books: serialize_books(@top_rated_books)
    }
  end

  private

  def serialize_books(books)
    ActiveModelSerializers::SerializableResource.new(books, each_serializer: Api::V1::HomeSerializer).as_json
  end
end
