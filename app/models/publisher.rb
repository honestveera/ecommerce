class Publisher < ApplicationRecord
  has_many :books, dependent: :destroy

  def as_json(options = {})
    super(options.merge(except: [:created_at, :updated_at]))
  end
end
