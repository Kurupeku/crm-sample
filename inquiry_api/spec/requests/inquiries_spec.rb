require 'rails_helper'

RSpec.describe 'Inquiries', type: :request do
  let(:headers) { { 'ACCEPT' => 'application/json' } }

  describe 'POST /' do
    context '正しいパラメーターを渡した場合' do
      let(:params) { generate_new_params(:inquiry) }
      it 'status: 201 (:created) が返ってくる' do
        post '/inquiries', params: params, headers: headers
        expect(response).to have_http_status(:created)
      end

      it '生成済みのデータが返ってくる' do
        post '/inquiries', params: params, headers: headers
        is_asserted_by do
          parse_body(response).dig(:data, :email) == params.dig(:inquiry, :email)
        end
      end
    end

    context '不正なパラメーターを渡した場合' do
      let(:params) do
        origin = generate_new_params(:inquiry)
        origin[:inquiry][:email] = nil
        origin
      end

      it 'status: 422 (:unprocessable_entity) が返ってくる' do
        post '/inquiries', params: params, headers: headers
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'エラー内容がHashの配列で返ってくる' do
        post '/inquiries', params: params, headers: headers
        is_asserted_by { parse_body(response).fetch(:errors).size == 1 }
        is_asserted_by { parse_body(response)[:errors].first == 'Emailは不正な値です' }
      end
    end
  end
end
