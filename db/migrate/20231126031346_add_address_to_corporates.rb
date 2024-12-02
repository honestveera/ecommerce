class AddAddressToCorporates < ActiveRecord::Migration[7.0]
  def change
    add_column :corporates, :address, :string, limit: 500
  end
end
