import openai
from trafilatura import fetch_url, extract, feeds, json_metadata
from bs4 import BeautifulSoup
import requests
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/116.0'}

openai.api_key = "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"


class ReadRss:

    def __init__(self, rss_url, headers):

        self.url = rss_url
        self.headers = headers
        try:
            self.r = requests.get(rss_url, headers=self.headers)
            self.status_code = self.r.status_code
        except Exception as e:
            print('Error fetching the URL: ', rss_url)
            print(e)
        try:
            self.soup = BeautifulSoup(self.r.text, 'html.parser')
        except Exception as e:
            print('Could not parse the xml: ', self.url)
            print(e)

        self.articles = self.soup.find_all('item')
        self.articles_dicts = [{'title': a.find('title').text, 'link': a.link.next_sibling.replace('\n', '').replace(
            '\t', '').replace('\r', ''), 'description': a.find('description').text, 'pubdate': a.find('pubdate').text} for a in self.articles]
        self.urls = [d['link'] for d in self.articles_dicts if 'link' in d]
        self.titles = [d['title'] for d in self.articles_dicts if 'title' in d]

        # self.descriptions = [d['description']
        #                      for d in self.articles_dicts if 'description' in d]
        # self.pub_dates = [d['pubdate']
        #                   for d in self.articles_dicts if 'pubdate' in d]


bbc = ReadRss('https://feeds.bbci.co.uk/news/rss.xml?edition=uk', headers)
guardian = ReadRss('https://www.theguardian.com/uk/rss', headers)

def to_json(articles, path):
    with open(path, 'w') as file:
        json.dump(articles, file)


# commented out below while messing with guardian
        
# articles = []
# for article in bbc.articles_dicts[:7]:
#     article_data = {}
#     article_data['title'] = article['title']
#     article_data['link'] = article['link']
#     downloaded = fetch_url(article['link'])
#     result = extract(downloaded, include_comments=False,
#                      include_tables=False, include_links=False,)
#     article_data['text'] = result
#     response = openai.ChatCompletion.create(
#         model="gpt-3.5-turbo",
#         messages=[
#             {"role": "system", "content": "You are a helpful summarisation tool that provides seven sentence summaries of text."},
#             {"role": "user", "content": "Please provide a seven sentence summary of the following: " +
#                 article_data['text']}
#         ]
#     )
#     article_data['summary'] = response['choices'][0]['message']['content']
#     articles.append(article_data)
        
# just messing with guardian below. No summarising
guardian_articles = []
for article in guardian.articles_dicts[:7]:
    article_data = {}
    print(article['title'])
    article_data['title'] = article['title']
    print(article['link'])
    article_data['link'] = article['link']
    downloaded = fetch_url(article['link'])
    result = extract(downloaded, include_comments=False,
                     include_tables=False, include_links=False,)
    article_data['text'] = result
    guardian_articles.append(article_data)

# to_json(articles, 'data/bbc.json')
to_json(guardian_articles, 'data/guardian.json') 
print(guardian.articles_dicts[:7])