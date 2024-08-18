# 1.1.0

- Added Odysee support
- Added Coursehunter support
- Fix EpicGames 3 and 5 symbols ids
- Rework VideoHelper logic

Now 1 helper = 1 file.

some GetVideoId service logic moved to helper file.

`/helpers/index.ts` - concat all helpers in one class.

# 1.0.5

- Added EpicGames support
- Added 9animetv support
- Fix embed Mail.ru videos
- Simplified logic for `/inbox/` and `/bk/` paths of Mail.ru videos

# 1.0.4

- Added support of `/inbox/` and `/bk/` paths for Mail.ru videos

# 1.0.3

- The behavior of the `data` field has been changed in case of a request error, now an error is written to it, if there is one
- Some default types of any have been replaced with unknown
- Removed extra console.log

# 1.0.2

- Added Reddit New & Reddit Old support
- Added more Peertube sites

# 1.0.1

- Added Poketube support

# 1.0.0

- Initial release
