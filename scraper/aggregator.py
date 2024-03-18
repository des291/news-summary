import requests
from bs4 import BeautifulSoup

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/116.0'}

class ReadRss:
    """This class is used to create an object that contains the data from a RSS webpage."""
    def __init__(self, rss_url, headers):
        """
        Parameters:
        rss_url: str
            url for RSS feed
        headers: dict
            dict containing 'User-Agent' value so scrape does not get blocked
        """
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
            '\t', '').replace('\r', ''), 'description': a.find('description').text} for a in self.articles]
        self.urls = [d['link'] for d in self.articles_dicts if 'link' in d]
        self.titles = [d['title'] for d in self.articles_dicts if 'title' in d]


bbc = ReadRss('https://feeds.bbci.co.uk/news/rss.xml?edition=uk', headers)
guardian = ReadRss('https://www.theguardian.com/uk/rss', headers)
indie = ReadRss('https://www.independent.co.uk/news/rss', headers)
