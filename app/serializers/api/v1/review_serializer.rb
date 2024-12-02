class Api::V1::ReviewSerializer < ActiveModel::Serializer
  attributes :id, :rating, :comment, :user_name

  has_one :book

  def user_name
    "#{object.user.first_name} #{object.user.last_name}"
  end

  def book
    {
      id: object.book.id,
      name: object.book.name,
      overall_rating: object.book.overall_rating
    }
  end
end
