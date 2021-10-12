# frozen_string_literal:  true

require 'rails_helper'

RSpec.describe 'Inquiries', type: :request do
  describe 'POST /' do
    context '正しいパラメーターを渡した場合' do
      let(:params) { generate_new_params :inquiry }
      it 'status: 201 (:created) が返ってくる' do
        post '/inquiries', params: params, headers: json_headers
        expect(response).to have_http_status(:created)
      end

      it '生成済みのデータが返ってくる' do
        post '/inquiries', params: params, headers: json_headers
        is_asserted_by do
          parse_body(response).dig(:data, :email) == params.dig(:inquiry, :email)
        end
      end
    end

    context '不正なパラメーターを渡した場合' do
      let(:params) do
        origin = generate_new_params :inquiry
        origin[:inquiry][:email] = nil
        origin
      end

      it 'status: 422 (:unprocessable_entity) が返ってくる' do
        post '/inquiries', params: params, headers: json_headers
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'エラー内容がHashの配列で返ってくる' do
        post '/inquiries', params: params, headers: json_headers
        is_asserted_by { parse_body(response).fetch(:errors).size == 1 }
        is_asserted_by { parse_body(response)[:errors].first == 'Emailは不正な値です' }
      end
    end

    context 'menu_ids に menu.id の配列を渡した場合' do
      let(:menus) { create_list :menu, 5 }
      let(:menu_ids) { menus.pluck(:id).flatten.sort }

      it 'Inquiry:Menu が N:N で関連付けされる' do
        params = generate_new_params :inquiry
        params[:inquiry][:menu_ids] = menu_ids
        post '/inquiries', params: params, headers: json_headers
        inquiry_id = parse_body(response).dig :data, :id
        is_asserted_by { Inquiry.find(inquiry_id).menu_ids.sort == menu_ids }
      end
    end
  end
end
