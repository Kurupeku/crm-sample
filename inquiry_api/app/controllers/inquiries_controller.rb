class InquiriesController < ApplicationController
  def create
    @inquiry = Inquiry.new inquiry_params
    if @inquiry.save
      render json: success_json, status: :created
    else
      render json: error_json, status: :unprocessable_entity
    end
  end

  private

  def inquiry_params
    params.require(:inquiry).permit(*inquiry_attribute_keys)
  end

  def inquiry_attribute_keys
    %i[
      company_name name email tel
      number_of_users introductory_term detail
    ]
  end

  def success_json
    { data: @inquiry.attributes }.to_json
  end

  def error_json
    { errors: @inquiry.errors.full_messages, data: nil }.to_json
  end
end
