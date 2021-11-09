# frozen_string_literal: true

module Types
  # Schema for Address model
  class AddressType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, Integer, null: false
    field :postal_code, String, null: false
    field :prefecture, String, null: false
    field :city, String, null: false
    field :street, String, null: false
    field :building, String, null: true
    field :created_at, Int, null: false
    field :updated_at, Int, null: false

    field :full_address, String, null: false
    def full_address
      object.full_address
    end

    field :full_address_with_postal_code, String, null: false
    def full_address_with_postal_code
      object.full_address_with_postal_code
    end

    def created_at
      object.created_at_unix
    end

    def updated_at
      object.updated_at_unix
    end
  end
end
