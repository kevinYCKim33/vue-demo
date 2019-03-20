class Player < ApplicationRecord
  belongs_to :team
  # can be a pg, center, #24, or whatever...extra attributes
end
