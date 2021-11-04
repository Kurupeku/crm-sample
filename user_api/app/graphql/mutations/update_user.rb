# frozen_string_literal: true

module Mutations
  # Mutation for Updating user
  class UpdateUser < BaseMutation
    class UpdateAddressInput < Types::BaseInputObject
      argument :postal_code, String, required: true
      argument :prefecture, String, required: true
      argument :city, String, required: true
      argument :street, String, required: true
      argument :building, String, required: false
    end

    argument :id, ID, required: true
    argument :company_name, String, required: false
    argument :name, String, required: false
    argument :email, String, required: false
    argument :tel, String, required: false
    argument :address, UpdateAddressInput, required: false

    type Types::UserType

    def resolve(id:, **args)
      user = User.find id
      user.assign_attributes(user_params(args))
      user.build_address address_params(args[:address]) if args[:address].present?
      user.save! && user
    end

    private

    def user_params(args)
      args.select do |key, value|
        key != :address && value.present?
      end
    end

    def address_params(address)
      %i[postal_code prefecture city street building].map do |key|
        [key, address.send(key)]
      end.reject do |_, value|
        value.blank?
      end.to_h
    end
  end
end
