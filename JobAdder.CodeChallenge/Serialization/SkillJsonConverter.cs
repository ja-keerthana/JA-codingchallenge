using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace JobAdder.CodeChallenge.Serialization
{
  public class SkillJsonConverter : JsonConverter<ICollection<string>>
  {
    public override ICollection<string> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
      => reader.GetString().Split(new char[] { ',' }).ToList();

    public override void Write(Utf8JsonWriter writer, ICollection<string> value, JsonSerializerOptions options)
      => writer.WriteStringValue(string.Join(',', value));
  }
}
