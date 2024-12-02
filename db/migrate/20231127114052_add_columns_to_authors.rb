class AddColumnsToAuthors < ActiveRecord::Migration[7.0]
  def change
    add_column :authors, :biography, :string
  end
end
