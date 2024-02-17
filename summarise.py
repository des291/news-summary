import requests
# import openai

# openai.api_key = "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"

# response = openai.ChatCompletion.create(
#     model = 'gpt-3.5-turbo',
#     messages = [],
#     temperature = 0,
#     max_tokens = 1024
# )

r = requests.get('https://www.bbc.co.uk/sport/football/66621772')
print(r.text)
