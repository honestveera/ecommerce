class CreatePrivacyPolicies < ActiveRecord::Migration[7.0]
  def change
    create_table :privacy_policies do |t|
      t.text :content

      t.timestamps
    end
  end
end
