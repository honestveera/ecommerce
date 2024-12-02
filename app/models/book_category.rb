class BookCategory < ApplicationRecord
    has_many :books, dependent: :destroy
    has_many :subcategories, dependent: :destroy
end
