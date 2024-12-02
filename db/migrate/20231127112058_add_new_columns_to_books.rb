class AddNewColumnsToBooks < ActiveRecord::Migration[7.0]
  def change
    add_column :books, :overall_rating, :float
  end
end
