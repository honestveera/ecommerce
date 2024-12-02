class AddColumnsToBooks < ActiveRecord::Migration[7.0]
  def change
    add_column :books, :amount, :integer, limit: 8
    add_column :books, :availability, :boolean, default: 1
  end
end
