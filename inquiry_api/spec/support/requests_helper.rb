# frozen_string_literal: true

def parse_body(response)
  JSON.parse(response.body).deep_symbolize_keys
end

def generate_new_params(factory_key)
  {
    "#{factory_key}": attributes_for(factory_key).reject do |key, _|
                        %i[id user_id created_at updated_at].include? key
                      end
  }
end
