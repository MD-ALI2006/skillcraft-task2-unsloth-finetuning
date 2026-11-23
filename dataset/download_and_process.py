"""
Data Processing Script for Banking77 Intent Classification
SkillCraft Technology - AI Engineering Internship Task 2
"""

import json
import os
from collections import Counter
from datasets import load_dataset

def process_banking77():
    print("Loading PolyAI/banking77 dataset...")
    ds = load_dataset("PolyAI/banking77")
    
    label_names = ds['train'].features['label'].names
    num_classes = len(label_names)
    
    train_texts = ds['train']['text']
    train_labels = ds['train']['label']
    
    test_texts = ds['test']['text']
    test_labels = ds['test']['label']
    
    train_counts = Counter(train_labels)
    test_counts = Counter(test_labels)
    
    # Calculate detailed class distribution
    class_distribution = []
    for idx, name in enumerate(label_names):
        readable_name = name.replace('_', ' ').capitalize()
        class_distribution.append({
            "id": idx,
            "label": name,
            "display_name": readable_name,
            "train_count": train_counts.get(idx, 0),
            "test_count": test_counts.get(idx, 0),
            "total_count": train_counts.get(idx, 0) + test_counts.get(idx, 0)
        })
    
    # Sort class distribution by total count descending
    class_distribution.sort(key=lambda x: x["total_count"], reverse=True)
    
    # Precompute sample queries per intent
    intent_samples = {}
    for text, label_id in zip(train_texts, train_labels):
        label_name = label_names[label_id]
        if label_name not in intent_samples:
            intent_samples[label_name] = []
        if len(intent_samples[label_name]) < 5:
            intent_samples[label_name].append(text)
            
    # Sample previews for exploration (first 500 samples each with full metadata)
    train_preview = []
    for i in range(min(500, len(train_texts))):
        train_preview.append({
            "id": f"train_{i}",
            "text": train_texts[i],
            "label_id": train_labels[i],
            "intent": label_names[train_labels[i]],
            "split": "train"
        })
        
    test_preview = []
    for i in range(min(500, len(test_texts))):
        test_preview.append({
            "id": f"test_{i}",
            "text": test_texts[i],
            "label_id": test_labels[i],
            "intent": label_names[test_labels[i]],
            "split": "test"
        })
        
    # Example instruction formatted samples
    instruction_template = (
        "Below is an instruction that describes a task, paired with an input that provides further context. "
        "Write a response that appropriately completes the request.\n\n"
        "### Instruction:\n"
        "Identify the specific banking intent behind the customer's query. Output the result in valid JSON with 'intent' and 'confidence'.\n\n"
        "### Input:\n{query}\n\n"
        "### Response:\n{{\"intent\": \"{intent}\", \"confidence\": \"high\"}}"
    )
    
    formatted_samples = []
    for sample in train_preview[:10]:
        formatted_samples.append({
            "query": sample["text"],
            "intent": sample["intent"],
            "formatted_prompt": instruction_template.format(query=sample["text"], intent=sample["intent"])
        })
        
    metadata = {
        "dataset_name": "Banking77 (PolyAI)",
        "source": "Hugging Face (PolyAI/banking77)",
        "domain": "Online Banking & Financial Customer Support",
        "num_classes": num_classes,
        "total_samples": len(train_texts) + len(test_texts),
        "train_samples": len(train_texts),
        "test_samples": len(test_texts),
        "validation_samples_suggested": int(len(train_texts) * 0.1),
        "avg_words_per_query": round(sum(len(t.split()) for t in train_texts) / len(train_texts), 2),
        "max_words_per_query": max(len(t.split()) for t in train_texts),
        "min_words_per_query": min(len(t.split()) for t in train_texts),
        "labels": label_names
    }
    
    os.makedirs("dataset", exist_ok=True)
    
    with open("dataset/banking77_meta.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
        
    with open("dataset/class_distribution.json", "w", encoding="utf-8") as f:
        json.dump(class_distribution, f, indent=2)
        
    with open("dataset/intent_samples.json", "w", encoding="utf-8") as f:
        json.dump(intent_samples, f, indent=2)
        
    with open("dataset/train_preview.json", "w", encoding="utf-8") as f:
        json.dump(train_preview, f, indent=2)
        
    with open("dataset/test_preview.json", "w", encoding="utf-8") as f:
        json.dump(test_preview, f, indent=2)
        
    with open("dataset/formatted_samples.json", "w", encoding="utf-8") as f:
        json.dump(formatted_samples, f, indent=2)
        
    print("Dataset processed successfully!")
    print(f"Total samples: {metadata['total_samples']}")
    print(f"Classes: {metadata['num_classes']}")
    print(f"Train: {metadata['train_samples']}, Test: {metadata['test_samples']}")

if __name__ == "__main__":
    process_banking77()
