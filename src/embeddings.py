"""
 Utilities for encoding images and captions.
"""
import torch
import torch.nn.functional as F
from PIL import Image
from transformers import CLIPProcessor, CLIPModel


class PostEncoder:

    def __init__(self) -> None:
        self._model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self._processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        self._model.eval()

    @staticmethod
    def _unwrap(out) -> torch.Tensor:
        # transformers v5 wraps outputs in a model output object rather than returning a plain tensor
        if isinstance(out, torch.Tensor):
            return out
        if hasattr(out, 'pooler_output') and out.pooler_output is not None:
            return out.pooler_output
        return out[0]

    @torch.inference_mode()
    def encode(self, image: Image.Image | None, caption: str | None, image_weight: float) -> torch.Tensor:
        image_embeds = torch.zeros((1, 512))
        text_embeds = torch.zeros((1, 512))
        if image is not None:
            img_inputs = self._processor(images=image, return_tensors="pt")
            image_embeds = self._unwrap(self._model.get_image_features(**img_inputs))
        if caption is not None:
            txt_inputs = self._processor(text=caption, return_tensors="pt", padding=True)
            text_embeds = self._unwrap(self._model.get_text_features(**txt_inputs))
        image_embeds = F.normalize(image_embeds, dim=-1)
        text_embeds = F.normalize(text_embeds, dim=-1)
        combined = image_weight * image_embeds + (1 - image_weight) * text_embeds
        return F.normalize(combined, dim=-1).squeeze(0)

    @torch.inference_mode()
    def encode_text(self, text: str | list[str]) -> torch.Tensor:
        inputs = self._processor(text=text, return_tensors="pt", padding=True)
        text_embeds = self._unwrap(self._model.get_text_features(**inputs))
        return F.normalize(text_embeds, dim=-1)