import React from "react";
import {withRouter} from "react-router";
import pattern_match from "./../img/pattern_match.png"

function About() {
  return (
      <section className="about">
          <h1>What&rsquo;s the Story? </h1>

          <p>Language is humanity&rsquo;s greatest social technology. While we&rsquo;ve been communicating for thousands of years, it is only recently that we&rsquo;ve begun sharing content online&mdash;posting selfies, searching for validation, and expressing our uninformed opinions in hot takes and quote tweets. Making sense of all that is being said is a tall order, best suited to a suite of algorithms. Computers can digest bits of language and help us describe, explain, and understand cultural phenomenon at the scale of human populations. The StoryWrangler instrument reflects our first step towards wrestling the day&rsquo;s events into coherence. It is an approximate daily leaderboard for language popularity around the globe.</p>

          <h2>The Data</h2>

          <p>While most of our online activity is not broadcast publicly, the things we do choose to share are important, and worthy of careful enumeration. One prominent source for real-time global information is social media. Half of a billion messages are posted to Twitter every day! Written on post-it notes, they would wrap around the Earth&rsquo;s equator in a neon hug full of politics, pop music, and sports.</p>

          <p>At the <a href="https://twitter.com/compstorylab" target="_blank" rel="noreferrer">Computational Story Lab</a>, since 2008 we have collected a random 10% of all public messages using Twitter&rsquo;s Decahose API.  Overall, our collection comprises roughly 150 billion messages requiring 100TB of storage. Inspired by the Google n-grams project which smashes books into bits, we&rsquo;ve meticulously parsed these tweets into daily frequencies of words, 2-word phrases, and three word expressions.  Scientists call these different types &ldquo;n-grams&rdquo; for n = 1, 2, 3.</p>

          <p>We&rsquo;re able to categorize tweets into roughly <a href="https://arxiv.org/abs/2003.03667" target="_blank" rel="noreferrer">170 languages</a>. To explore how people are feeling, at the site for our flagship instrument <a href="http://hedonometer.org/" target="_blank" rel="noreferrer">hedonometer.org</a> we use this same data to visualize daily sentiment in 9 languages. Importantly, this site offers visitors the opportunity to toggle retweets on and off, allowing for the inclusion or exclusion of social amplification. While we&rsquo;re not able to share individual tweets, we do provide an API for exporting relative frequency data at the daily resolution. Source code associated with the API can be found <a href="https://github.com/janeadams/storywrangler" target="_blank" rel="noreferrer">here</a>, and the pattern match used to parse tweets can be found <a href="https://gitlab.com/compstorylab/storywrangler" target="_blank" rel="noreferrer">here</a>.</p>

          <h2>The Visualization</h2>

          <p>Sorting frequencies by popularity, we find some n-grams that appear very consistently in time. For example, <a href="https://storywrangling.org/ngrams?ngrams=god" target="_blank" rel="noreferrer">&ldquo;god&rdquo;</a> is roughly the 300th most commonly used word each day.  Others rise and fall cyclicly. &ldquo;Friday&rdquo;, &ldquo;New Year&rsquo;s Eve&rdquo;, and &ldquo;Winter Olympics&rdquo; spike every week, year, and four years <a href="https://storywrangling.org/ngrams?ngrams=Friday,New%20Year%E2%80%99s%20Eve,Winter%20Olympics" target="_blank" rel="noreferrer">respectively</a>. For one glorious day in 2015, &ldquo;<a href="https://storywrangling.org/ngrams?ngrams=%F0%9F%98%8A" target="_blank" rel="noreferrer">&#x1F60A;</a>&rdquo; was the most commonly used word! Many many many more phrases appear very rarely. </p>

          <p>The shapes of our collective attention are quite universal. <a href="https://storywrangling.org/ngrams?ngrams=Christmas,Halloween,Thanksgiving,July%204th,Easter" target="_blank" rel="noreferrer">Holiday</a> mentions build exponentially to a crescendo before falling precipitously. <a href="https://storywrangling.org/ngrams?ngrams=Avengers" target="_blank" rel="noreferrer">Movies</a> produce a more symmetric pattern centered on their release date. And mentions of individual years reliably plateau chronologically, with a <a href="https://storywrangling.org/ngrams?ngrams=2010,2012,2014,2016,2018,2020" target="_blank" rel="noreferrer">volcanic rim</a> bounded by their beginning and end.</p>

          <p>We hope journalists, linguists, political scientists, and the extremely online alike are able to use this data to characterize collective attention in new and interesting ways.  Have at it!</p>
          <p>&#x1F41B; <em>Found a bug? <a href="https://github.com/janeadams/storywrangler/issues" target="_blank" rel="noreferrer">Submit an issue on GitHub here</a>.</em></p>

          <h2>Some of the many gory details</h2>

          <p><img id="pattern_match" src={pattern_match} alt="Screenshot showing pattern-matching regex"/> Parsing tweets into components is <a href="https://twitter.com/compstorylab/status/1195888902646710272" target="_blank" rel="noreferrer">harder</a> than we expected, so we have a few specifics to share about how it is being done. Regarding the definition of an n-gram, 1-grams are bounded by spaces. 2-grams comprise a pair of 1-grams with a space between them. Punctuation is <a href="https://twitter.com/compstorylab/status/1255882917357780994" target="_blank" rel="noreferrer">hard</a> so we&rsquo;ve left it in.</p>

          <p>Our pattern match is restricted to n-grams containing at least one latin character or emoji. Hashtags and handles are in. URLs and carriage returns and other unicode trouble are out. The database is case sensitive, so if you&rsquo;re looking for the popularity of playing card game &ldquo;Trump suits&rdquo;, you&rsquo;ll want to use the lower case version &ldquo;trump&rdquo;.</p>

          <p>For simplicity, and to avoid requiring atomic clocks with relativitistic space-time corrections, we use Eastern time in the US when assigning n-grams to a calendar day. Ranks are thresholded at 1 million, so if a phrase is less popular than this cutoff on an individual day, we don&rsquo;t offer information on its prevalence. Provided the computers aren&rsquo;t on &#x1F525;&#x1F525;&#x1F525;, daily ranks will be updated within roughly 48 hours. Somewhat confusingly, more popular words have lower rank and rare words have large rank. Ranks are calculated within a single category of n-gram, so while you can plot &ldquo;NSync&rdquo; against &ldquo;Backstreet Boys&rdquo;, their relative rankings are computed against different collections.</p>

          <h2>Obligatory Warnings</h2>

          <p>As a reflection of global events, Twitter data is problematic for several reasons. &ldquo;Tweets are a non-representative subsample of utterances made by a non-representative subsample of Earth&rsquo;s population.&rdquo; Pew surveys suggest only 1 in 5 adults Americans use the service. Our data reflects only a random 10% of messages. This means that for exceedingly rare words, while the frequencies reported here are roughly one tenth of the true values, the rankings are likely to be unreliable. We make no attempt to remove automated account activity, but selecting the &ldquo;exclude retweets&rdquo; option will likely reduce the contribution of coordinated bot behavior. </p>

          <h2>Attribution</h2>

          <p>If you use the data from our site in a scientific study, please cite it:</p>
          <ul className="citation"><li><h1>Storywrangler: A massive exploratorium for sociolinguistic, cultural, socioeconomic, and political timelines using Twitter.</h1>
              <h2>Thayer Alshaabi, Jane L. Adams, Michael V. Arnold, Joshua R. Minot, David R. Dewhurst, Andrew J. Reagan, Christopher M. Danforth, Peter Sheridan Dodds.</h2>
              <h3>In real-time, Twitter strongly imprints world events, popular culture, and the day-to-day; Twitter records an ever growing compendium of language use and change; and Twitter has been shown to enable certain kinds of prediction. Vitally, and absent from many standard corpora such as books and news archives, Twitter also encodes popularity and spreading through retweets. Here, we describe Storywrangler, an ongoing, day-scale curation of over 100 billion tweets containing around 1 trillion 1-grams from 2008 to 2020. For each day, we break tweets into 1-, 2-, and 3-grams across 150+ languages, record usage frequencies, and generate Zipf distributions. We make the data set available through an interactive time series viewer, and as downloadable time series and daily distributions. We showcase a few examples of the many possible avenues of study we aim to enable including how social amplification can be visualized through &#39;contagiograms&#39;.
                  <a href="https://arxiv.org/pdf/2007.12988.pdf" target="_blank" rel="noreferrer">[pdf]</a>
                  <a href="https://arxiv.org/abs/2007.12988" target="_blank" rel="noreferrer">[arXiv]</a>
                  <a href="https://twitter.com/compstorylab/status/1287914727763517452" target="_blank" rel="noreferrer">[thread]</a></h3></li></ul>

          <h2>Related Publications</h2>

          <p>A few example studies we&rsquo;ve undertaken recently using this data:</p>

          <ul className="citation">
              <li>
                  <h1>Allotaxonometry and rank-turbulence divergence: A universal instrument for comparing complex systems.</h1>
                  <h2>P. S. Dodds, J. R. Minot, M. V. Arnold, T. Alshaabi, J. L. Adams, D. R. Dewhurst, T. J. Gray, M. R. Frank, A. J. Reagan, C. M. Danforth.</h2>
                  <h3>In Review. 2020.
                      <a href="http://www.uvm.edu/~cdanfort/research/dodds-allotaxonometer-2020.pdf" target="_blank" rel="noreferrer">[pdf]</a>
                      <a href="https://arxiv.org/abs/2002.09770" target="_blank" rel="noreferrer">[arXiv]</a>
                      <a href="http://compstorylab.org/allotaxonometry/" target="_blank" rel="noreferrer">[online appendix]</a>
                      <a href="https://gitlab.com/compstorylab/allotaxonometer" target="_blank" rel="noreferrer">[code]</a>
                      <a href="https://twitter.com/compstorylab/status/1232333645249155072" target="_blank" rel="noreferrer">[thread]</a></h3></li>

              <li><h1>How the world&rsquo;s collective attention is being paid to a pandemic: COVID-19 related 1-gram time series for 24 languages on Twitter.</h1>
                  <h2>T. Alshaabi, M. V. Arnold, J. R. Minot, J. L. Adams, D. R. Dewhurst, A. J. Reagan, R. Muhamad, C. M. Danforth, P. S. Dodds.</h2>
                  <h3>In Review. 2020.
                      <a href="http://pdodds.w3.uvm.edu/permanent-share/covid19-ngrams-revtex4.pdf" target="_blank" rel="noreferrer">[pdf]</a>
                      <a href="https://arxiv.org/abs/2003.12614" target="_blank" rel="noreferrer">[arXiv]</a>
                      <a href="http://compstorylab.org/covid19ngrams/" target="_blank" rel="noreferrer">[online appendix]</a>
                      <a href="http://compstorylab.org/covid19ngrams/barcharts/" target="_blank" rel="noreferrer">[animation]</a>
                      <a href="https://twitter.com/compstorylab/status/1243659358107467782" target="_blank" rel="noreferrer">[thread]</a></h3></li>

              <li><h1>The growing echo chamber of social media: Measuring temporal and social contagion dynamics for over 150 languages on Twitter for 2009-2020.</h1>
                  <h2>T. Alshaabi, D. R. Dewhurst, J. R. Minot, M. V. Arnold, J. L. Adams, C. M. Danforth, P. S. Dodds.</h2>
                  <h3>In Review. 2020.
                      <a href="http://www.uvm.edu/~cdanfort/research/alshaabi-languages-2020.pdf" target="_blank" rel="noreferrer">[pdf]</a>
                      <a href="https://arxiv.org/abs/2003.03667" target="_blank" rel="noreferrer">[arXiv]</a>
                      <a href="http://compstorylab.org/share/papers/alshaabi2020a/" target="_blank" rel="noreferrer">[online appendix]</a>
                      <a href="https://twitter.com/compstorylab/status/1243299769251921921">[thread]</a></h3></li>

              <li><h1>Fame and Ultrafame: Measuring and comparing daily levels of &lsquo;being talked about&rsquo; for United States&rsquo; presidents, their rivals, God, countries, and K-pop.</h1>
                  <h2>P. S. Dodds, J. R. Minot, M. V. Arnold, T. Alshaabi, J. L. Adams, D. R. Dewhurst, A. J. Reagan, C. M. Danforth.</h2>
                  <h3>In Review. 2020.
                      <a href="https://arxiv.org/pdf/1910.00149.pdf" target="_blank" rel="noreferrer">[pdf]</a>
                      <a href="https://arxiv.org/abs/1910.00149" target="_blank" rel="noreferrer">[arXiv]</a>
                      <a href="https://twitter.com/compstorylab/status/1179370693781282817" target="_blank" rel="noreferrer">[thread]</a>
                      <a href="http://compstorylab.org/ultrafame/" target="_blank" rel="noreferrer">[online appendix]</a></h3></li>

              <li><h1>The shocklet transform: A decomposition method for the identification of local, mechanism-driven dynamics in sociotechnical time series.</h1>
                  <h2>D. R. Dewhurst, T. Alshaabi, D. Kiley, M. V. Arnold, J. R. Minot, C. M. Danforth, P. S. Dodds.</h2>
                  <h3>EPJ Data Science. 2020.
                      <a href="http://www.uvm.edu/~cdanfort/research/2020-dewhurst-epj.pdf" target="_blank" rel="noreferrer">[pdf]</a>
                      <a href="https://epjdatascience.springeropen.com/articles/10.1140/epjds/s13688-020-0220-x" target="_blank" rel="noreferrer">[journal]</a>
                      <a href="https://arxiv.org/abs/1906.11710" target="_blank" rel="noreferrer">[arXiv]</a>
                      <a href="http://compstorylab.org/shocklets/ranked_shock_weighted_interactive.html" target="_blank" rel="noreferrer">[online appendix]</a>
                      <a href="https://gitlab.com/compstorylab/discrete-shocklet-transform" target="_blank" rel="noreferrer">[code]</a>
                      <a href="https://twitter.com/compstorylab/status/1227946808321728512" target="_blank" rel="noreferrer">[thread]</a>
                  </h3></li>
          </ul>

          <h2>Contact</h2>

          <p>Share the interesting things you notice! Questions and comments can be sent to <a href="https://twitter.com/storywrangling" target="_blank">Storywrangler on Twitter</a> or via <a href="https://github.com/janeadams/storywrangler" target="_blank" rel="noreferrer">GitHub</a>.</p>

          <h2>Acknowledgements</h2>

          <p>The front end of the site was built by <a href="https://twitter.com/artistjaneadams" target="_blank" rel="noreferrer">Jane Adams</a>. The back end was built by Michael Arnold, Thayer Alshaabi, Josh Minot, and Andy Reagan. The project is lead by <a href="https://twitter.com/peterdodds" target="_blank" rel="noreferrer">Peter Dodds</a> and <a href="https://twitter.com/ChrisDanforth" target="_blank" rel="noreferrer">Chris Danforth</a>, and their research group the <a href="https://twitter.com/compstorylab" target="_blank" rel="noreferrer">Computational Story Lab</a> at the University of Vermont. Several students have contributed including:</p>

          <p>Sharon Alajajian, Nicholas Allgaier, Catherine Bliss, Eric Clark, Emily Cody, Ethan Davis, Todd DeLuca, Suma Desu, David Dewhurst, Danne Elbers, Kameron Decker Harris, Fletcher Hazlehurst, Sophie Hodson, Kayla Horak, Ben Emery, Mike Foley, Morgan Frank, Ryan Gallagher, Darcy Glenn, Sandhya Gopchandani, Kelly Gothard, Tyler Gray, Max Green, Laura Jennings, Dilan Kiley, Isabel Kloumann, Ben Kotzen, Paul Lessard, Ross Lieb-Lappen, Kelsey Linnell, Ashley McKhann, Andy Metcalf, Tom McAndrew, Sven McCall, Henry Mitchell, Lewis Mitchell, Kate Morrow, Eitan Pechenick, Michael Pellon, Aaron Powers, Andy Reagan, John Ring IV, Abby Ross, Lindsay Ross, Aaron Schwartz, Anne-Marie Stupinski, Matt Tretin, Lindsay Van Leir, Colin Van Oort, Brendan Whitney, and Jake Williams.</p>

          <p>Funding for the project has been provided by the Vermont Complex Systems Center, MassMutual, the University of Vermont and the Vermont Advanced Computing Core. Many thanks and acknowledgments go to these lovely people:</p>

          <p>Mike Austin, Jim Bagrow, Josh Bongard, Josh Brown, Jim Burgmeier, Melody Burkins, Kate Danforth, Andrea Elledge, Maggie Eppstein, Bill Gottesman, Laurent Hebert-Dufresne, John Kaehny, Jim Lawson, Juniper Lovato, Aimee Picchi, Tim Raymond, Andrew Reece, Tony Richardson, Taylor Ricketts, Melissa Rubinchuk, Brian Tivnan, John Tucker, Toph Tucker and Alexa Woodward.</p>

          <p>And as always, thank you for your tweets. They are mostly good.</p>
      </section>
  );
}

export default withRouter(About);
