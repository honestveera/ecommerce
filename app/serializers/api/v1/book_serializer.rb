class Api::V1::BookSerializer < ActiveModel::Serializer
  attributes :id, :name, :availability, :isbn_number, :image_name, :amount, :subcategory, :overview, :overall_rating

  has_many :reviews, serializer: Api::V1::ReviewSerializer
  has_one :category
  has_one :author
  has_one :publisher

  def category
    {
      id: object.category.id,
      name: object.category.name,
      image_name: format_image_name(object.category.image_name),
      subcategories: ActiveModelSerializers::SerializableResource.new(object.category.subcategories, each_serializer: Api::V1::SubcategorySerializer)
    }
  end

  def subcategory
    {
      id: object.subcategory.id,
      name: object.subcategory.name
    }
  end

  def subcategories
    object.category.subcategories.map do |subcategory|
      {
        id: subcategory.id,
        name: subcategory.name
      }
    end
  end

  def author
    {
      id: object.author.id,
      name: object.author.name,
      image_name: format_image_name(object.category.image_name),
      biography: object.author.biography
    }
  end

  def information
    object.information
  end

  def overview
    object.overview
  end

  def image_name
    format_image_name(object.image_name)
  end

  private

  def format_image_name(image_name)
    image_name&.sub('public/uploads', '')
  end
 
end