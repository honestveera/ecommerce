class AddNewColumnsToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :phone, :string
    add_column :users, :employeeid, :string
    add_column :users, :office_address, :string
  end
end
