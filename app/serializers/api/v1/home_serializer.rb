# app/serializers/api/v1/home_serializer.rb
class Api::V1::HomeSerializer < ActiveModel::Serializer
  attributes :book_id, :book_name, :image_name, :author_name

  def book_name
    object.name
  end

  def image_name
    object.image_name&.sub('public/uploads', '')
  end

  def author_name
    object.author.name
  end

  def book_id
    object.id
  end
end
