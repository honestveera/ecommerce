class AddInformationAndOverviewToBooks < ActiveRecord::Migration[7.0]
  def change
    add_column :books, :information, :string, limit: 500
    add_column :books, :overview, :string, limit: 500
  end
end
