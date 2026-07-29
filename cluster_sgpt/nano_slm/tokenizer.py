import json

class NanoTokenizer:
  """
  Lightweight Character/Byte Tokenizer for NanoSLM.
  Designed for zero-dependency execution on low-memory edge devices like Raspberry Pi 3.
  """
  def __init__(self, vocab=None):
    if vocab is None:
      # Default ASCII + Common Punctuation Vocab (256 bytes + special tokens)
      self.chars = [chr(i) for i in range(32, 127)] + ['\n', '\t', '<PAD>', '<UNK>', '<BOS>', '<EOS>']
      self.char_to_id = {ch: idx for idx, ch in enumerate(self.chars)}
      self.id_to_char = {idx: ch for idx, ch in enumerate(self.chars)}
    else:
      self.chars = vocab
      self.char_to_id = {ch: idx for idx, ch in enumerate(self.chars)}
      self.id_to_char = {idx: ch for idx, ch in enumerate(self.chars)}

    self.pad_id = self.char_to_id.get('<PAD>', 0)
    self.unk_id = self.char_to_id.get('<UNK>', 1)
    self.bos_id = self.char_to_id.get('<BOS>', 2)
    self.eos_id = self.char_to_id.get('<EOS>', 3)
    self.vocab_size = len(self.chars)

  def encode(self, text):
    return [self.char_to_id.get(ch, self.unk_id) for ch in text]

  def decode(self, ids):
    return "".join([self.id_to_char.get(idx, "") for idx in ids if idx not in (self.pad_id, self.bos_id, self.eos_id)])

  def save(self, filepath):
    with open(filepath, 'w', encoding='utf-8') as f:
      json.dump(self.chars, f, ensure_ascii=False)

  @classmethod
  def load(cls, filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
      vocab = json.load(f)
    return cls(vocab)
