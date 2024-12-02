class Api::V1::AuthorSerializer < ActiveModel::Serializer
  attributes :id, :name, :image_name, :biography

  def image_name
    object.image_name&.sub('public/uploads', '')
  end
end
