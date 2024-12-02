class CreateCorporates < ActiveRecord::Migration[7.0]
  def change
    create_table :corporates do |t|
      t.string :name
      t.date :subscription_date
      t.date :validity
      t.boolean :active

      t.timestamps
    end
  end
end
