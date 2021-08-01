-- Custom type to use as Moscow value for fragnets. Not needed but I wanted to try something simple for my first custom type.
CREATE TYPE prj.TY_Moscow AS ENUM
  ('Must Have', 'Should Have', 'Could Have', 'Wont Have');
