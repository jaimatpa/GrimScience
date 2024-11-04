import { format } from "date-fns";
import puppeteer from "puppeteer";
import { getJobOperationsById } from "~/server/controller/engineering/ChangOrder";
const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAASwAAAC3CAYAAACoq2NBAAA2ZUlEQVR42uxdCZwdRZmvqu53zZFMJplMQkJICAkQIQguGhERV0WURVRAFgjkeBOOxCMzgwcugsLqIjIzrMqZeZNwCK6y6i4/UZFLQBFZhEgIIuHIPZO573d0V+1X1f1m3tzzuvpNZpLvDy/vzTu6u76q+tf/q/7qKyqEIAgEAjEVwNAECAQCCQuBQCCQsBAIBBIWAoFAIGEhEAgEEhYCgUDCQiAQCCQsBAKBQMJCIBBIWAgEAoGEhUAgEEhYCAQCCQuBQCCQsBAIBAIJC4FAIGEhEAgEEhYCgUAgYSEQiEMIJpoAwaIVQUb4THg5nxJ2NKd0EediIWP0CCZECbwfcr4pOjhl9UzwNwmhb8Abr1Eq3hWCtqVi1ZhrG5FzUMzpfphVeLTSDFA+F0jmVIuQs2DEOhsI6qjM76g2QQUxBO1/D/6jhI502CY4xgNciM2M0m12bRVHSyOQsBBZwyirlCwzE5TSGTYVq4GgPgXEYgLBEDao7oFsCIe3bPk7eHCXn0x4jyvCYgQUFZE/kwSW/j5xX1vyFSdNjLFKOPZDoLpSWAMIJCzE6C7e2o2UUXIUJ+xCqOENQFJHSTJhwiEhs09JUQIkpojLIR9BJJHJz7nbLuT7KeEQWIYGU+Qlfyu/mz62fN9tVo7qIvR8Hqt+BmsEgYSFGIJAtHyuJcgloHC+CoRTKslGkY5LRNwlpvR7klTg8Q48/g6kswfIp8Mios0gArxBowi+Uwq/OxaeT4LPSxWRDTpOJuT76e9koBbOfjWvrbGwhhBIWId7BUYrwgbhZ9uEfhdoaJkjgDgxqXTtqJqPAgKLA+n8H7hxvwJ374/wvXfgO62U0hQf52Q5qLYgoWweKK1PwHG+YstzwXmoJCfhOIzwuaQrom4+w3vqLXkNRLxoEvphcBETWGMIJKzDEGZ04wKovmuAOK6mwjZBETlkAW6enE6Cv/5gCbEFyOoZLsg+EavyVeEEohVz4OnrQIAbFVkpgnKIiqZdQ/hbzd8T9dmLQG6n2bVVqLQQSFiHA4wyOZctToNaq4ZqO5UBIfC+6hNxcNPquOBbQM38baLUDCsrn0kJ28wEP1cqOnAniSVIn9qCBqbUl0GFVHz3i1jN5ViTCCSsQxigZgKc0s+D6/efFpdzU0RNegMseH8L5/zH8M42UVdtHyQilZNW/yq4/aBSVcSZrBcuWSnSknclnamts0Bl/R5rFYGEdYiBrd0Ygg6/xqT0B/BnQfp9IKkXgaS+Be8/PZnmhYC4ToUG9Sd5I3Jw2ETGRHwbqMJScFGTWMMIJKxDAMGy8lBKsDKTiFvhz7DlKBYLCOBmeHk7kFT95FWD5adzyp5VJOXeNZThDpw6q8AkiVmElgFhxbCmEUhYU9z1g84cBaKSMQDy7h+4UsZezkU5Y/R/wJVKTo1ylFdC07o1rbJksKkkXRV4qiblaRM4iaVWrAYj4hFZAdcSTgbXL1oBAoqeD135HirsIkve8RP8Zejp6+Hjv4i66inWsWkNkNUVUJalcg7LEkzNX4EbSwIgtFKCzoIvyRCMbVj7CCSsqaOoKHTsDzLCf0YFmyeEUlTPwUdXirqa7VO1XOCycqOs8l9BUf3Vkm6hukPYr+QleRlEXAYvv46tAIEu4VQYKaIbF3BB/gsIakWAcrn85Qno01cBUe04RFSj1InbgLCWmTI6nsqQB1lO5jY8e69B2ZGY5QGBhDWZDR4tzzMJ/YFNyHoVZMmMF+HtVXZt1euHWllBZX2WCv7L/lBSuU6Rq2dLvRb5QFg92CoQ6BJOvs4r7+t/AcjqAeisMsXLWynCLuK1VS8duqMhf9xdmkNkkCtTcVnO0mhTBZiKUuKsZUQgxqfc0QQToaoqFkNnlRPMPwXXqAvI6lyLkCUiVv3SoVxuK1bTBRS1XZKVdAelWyj/s9UaRLVm50hsHQhUWJMEwbLyoMXF9xgzKm0ZoiDINdBLf2jHag6bPFFciF8wwpfZtH9sBDdY5dxilJRiK0EgYU0OVbUC1MRvBKFFhNsPQyddx2NVbYedhKfkBVtlbyBqYbQKIOVOlgc3LTMCgYR18IiqMg866SaTiEvgz52csTPt2tu2Hq724IS9bahEN4xYanWOSncj7xLKEI58bDGIrAZANIGfZFV+hkF4AzwusQj7IoiIxXZt1dbD2iaUtiotpdYSOtlM5WJoqbo453FsNQhUWBPN+mXlYeiUMXABLxGUPiGE+IKIVbWgZeQcFukl7sLnzIylMnuXTRkSFgIJa2JVVcWpAUoeA5IKW4SeYxL+m2SsBoPb0mROiUhnbZDrCU3B5YpC9TpAeTNaCIGENQEwyipNKvjNJqGVKUH+i1EaFbVV3WiZQQqLc2At1rfRRXqFjpMvi9SjhRBIWLl3AY80BH2KU1ZKhfiIiNXgzjAjETuVSwndHXgyVlW4r5GwEEhYuUIgWi4nYy4DrXAvSIWHodOtwqUlYygsSgrldmLpDStEejNWtVEGbUILIZCwckJWFWFC6EPw8uwA5ecka2seRauMDeClGZKjZCiD2sGHEjd1MumyCUGyRyBh+W6k6MalNjGegc72JnS2uby2pg2tMk7bUbLIkgGjaqrdmdOizhKdV3isGhP4IZCw/HUB6WroXHUmEV+2BP2xwHQoWbqE7GQnQwMntnAcQrlnYoqw/0XrIJCwfIJRVhk0KNlscf4RUFZLrNihkadq4l1C+0xLbfPV/57FVVK/p9E6iGyBke7Dk1UpE3y7nCw2KFtsxW5DsvIAGq2UuZH/SU61c3f+SgVmKZ0ltqOFEKiwdBk8WnG6QchvbEJX8Vj1L9AiOo1LzARqCqe3+OLUCWewKX0rFavBmDUEEpZ3NVBOTUKvgdF/NYz+S/gk3kpryriDhJ9iCUOl8JNLcQw1+6fI6260DgIJyytZrS0PmJQ+CC/3gCo4KRWrttAqPhAWNS6Q8QvpuxRpozJK/wetg0DC8gCjrLIIyOpJm4pKXlvzFDYJ3wYBBna9gGWQlameaRe4hW+hhRBIWFkiEK1YahBxj03Zx3ltNWZX8JWx6HxOaZGcbCdqqy/qpkjmtanaGhsNhEDCyk5ZfRK60kcEoR8TtVXYgXwGuH3nCcLV3BUHmSX3JWQC/qb0HrQOAgkrCwTLyjdwQV8VsepvYhPIiXKVqwa/Qt09ckzXJbQFbQKN9QZaCIGENb6OxCwiKk1CNwNZ4cLb3GEu+IGLHaWlkvip6HbCyM3JWlyOg0DCGo8LGCCUrqGc16TqaqbkXcA169YzuecMIaLvzpsKwVTPVCX2dBcWp90ykt4oV/67ZdMdE1JuS4jLKVymvBJbOCmR1ewVlVkuEAjvOCx2fgayyuecnybqan4/lctx4UUX7+7uaJvv9fel848u3Lzp9q4c29qANtVEBC+SNCWVlVxDKCh7AlTtx7HLIXRwyC/NkWEL8DRnqpOVRCqZKNEanSYgnQsT4r2SrExGB0v5a7G7IaakSwiujQm6rhj8lSPgMQdG5Plc8NnwukhwPl1NeSj3Rro1rJ0y2g7drZFSupsyVg+exi5msNa6e25Pjtp5ohXFMMpbIlY15eN+pDuYTMRDXn8fCIasuk23T8T80Y0GuINqYy+5BaHjkDaAL/oSdjfEpCes1WVXzwV37EzbSn06lYyfnoj3zksl4gE/jv2Zz5zHQ+G8xkAo9IppBh5nhvkHStlr4Pb0sLLyYkZEpxW77VDZZTmPaLjvwXAk50uNaLRiJjSoT8t4q3Q6ZPWakK9YmPsKMRkJa826DXm2bZ2XSvR+qbur/f1WMmnk6uKtVJLBo5R0kk/Cn59Mv//Zz34ueX4kb0cknH8XEOb/MsZ2gxqb2h1GCK1t3c1A8K0JaExfSpNVesEzoAto65fY1RCThrCApBjn9qfiPV23dLa3LCMHeSIfXKcgPJZ1k5Yfwp8/NMwAv3jlqmcfeuDeM6cuX4mFOr83DPP1XF6fTCENJPV1GSyqtqMnbmYGQr5lx25LYldDHHTCAqIK2lby2vbWpn/zy83LBcAdZbZlHTGVKwrc6mP1CMt4NafXR+ml8BQ2BCUyJbLM4Q6Ig1uOmRkQB5ew5AQwkEBFW/OB70u3bCoUNBgKT+mFzaBgT9T5PaUsZxHmco9GUIC3yjAGlajPIStiEXGdiNX0YjdDHDTCWl121XEdrc0vgvtXMJUKCi7RlA5rsG3reK0DUPpuDtXf+cBVRbIxyR29qDOHFYdXd2AXQ/iJrNTRytXR6gN7d74+1chKFdRgL0zligIlu1ir/Iw15OK6AtEKM8DIj2WUly13x3En3JkQXxOxalRXiIlXWGuv2GB2d7Zv7WxrXjZ1i0r3TuWKSiUTs3V+DzySo6BRcYkQdJZaBiQfcmd6YXdRSnHuCjHxhLVm3fogENW+nq6OmVO1kOH8wo7Nm+6Y0mEN04pmfk8IwWjG+sB+b2/oe32LDJ0vdG7OQdBoIFoe5JTdrhQcnF8l6YNrsSkps2pr8M4gYmIJS0akT3WyUoQVzvvLVK+o+zZv+s5kuyZbiC8ZhBfIMAbpBsrlC5SKnSC1fo5dC5ELsFHIivV0tr8x1clKwggEHseq9nmki24spMy4Waoq3qfu1PNFuKMzYsIVVioRv7ezveXoCbmIQJCH8/J3wfMbjBnvgIvTDI826dcIwSVhhjjnJYLzObadOiqVTBwR7+3JH2+AqmGYT2NV+wtBjR8Ibptpz1Mmk7EEeUzEal5A6yAmlLBWR6/+QEvj/pW5OillTM7JPB8MR6qBoB7fvOmONi/HWXvFhiLbtk/gtnVOMtF7fldH2xIgtaHno/Q1rGpf1dUiRtiVnDmrrgx34AD2uhytg8glhuTDksts2prruxO9PWG/TxYMhZPTikuuAcVzN5CU75Oy0o2F8pwK6vAaUIefl0GthmnyRx55xMCq9sm9LqukYGSpok5Nrxd0Fzpfl4pVfxcthJhQhWWlEjf4TVZSURWXzP0uuHzX5/JunXts2ZkulOTFbfvjNrc/N9mMLq8NVF9QuVZCJKfSHUwgp3NsKk6VS3BY/2AnY7xuGVMRw2AoiHDKTUhyS47LrQYwaONgbNO185Tdb9LJNkuCbnbZ5OYcpwpa7Z4PbMcmk+0GKCx5V7Cpfk9Crr3z6wSR/IKuwqJZS7fU3rn/cB4ZVpddvTyVjH+rt7vzU4l4b75yXeW2VzLIkhlyDm9fMBR5DEh9M2PsT5kkJutFk8itMTrCuOr78eC0SH08uQ+UVUEGWcm9Bj8oYlV/HubYsy0rtSYZ710Z7+k6Dl6b6fYmyx0KR7rDkYInQXn/JwxqT+kSN5yvCAapi5KJ3lW9PV2npJKJkHC3GSOOnUUoktcajuQ9EwiE6uCcv9NR+rJT02FsN47QEz5WWdeUrZ9r2cp2l/b2dB5rW5aRaTsoQ1coUvB4IBiqgXI8p0v+UJZiYVuXJhPxS6GNnpxKJYODbQfnbAH7PQW2i8E5n8yFl5QVYV22Zt3Xm+v33OzXwQumzdiVP61oycEo2CQiqvd2tbc8ns3d1llz5n87M4zhc5+/oAc6YcTrNfz617+mI312+dorypob9m4az3FeW7jc2htPKPJMp5GxCfkvHqv+1wFljl710e6ujvu6O1rHnc7ZDAbtouLZNxlm4KZsiQtsfDJ0soc625qzWiDuzKXOego64cUwoGa9EgD6S3nLgX3V2f5uZum8q+6ru2fYwNpV0avO6u5su6+ns710/LYLWdOLS64zzcAPsrfdVSugbT7U1d66MCvbGYaYPmPWY6Fw3uVwzgMHxSWEjvVtvw6cX1i0H8hqsd9SkkUr5hiE9KVKyci71B+8OOgzpjZm4DIHJgF35lZeW/PdERr+3Lam+ndJ+pju6NL32hneBv7tomhm6blbYnc9lqlcUol4XUvj/lVZl5EZz2ceJxHviXhN2RMIhVOjj1hQFD52G+cnnk52t7SYbIDNRRz+Luu/1g2zuztbX8i28SuVlkwaoO6/DUrzq6AuTt5ce8eb41AFRb1dHc8CUZ3gxTay3O0tBz4KdVp/6eVrHgqEIiuzUSpUumg8e2HDKNsxXNvr7mh7Cchqbva2S5hSaITzCq6D45wA5LtzHLab1dvV/qfOtpYlnmxn27StqeGTYLuGlZevvQdsd/XmCchoyzIMdpxfc1eyk+RPn3FMLvxeRvhscEGK0g+m0irDA57l30S+D68lh8j3uSBFoAKKOGHqGd7fPXItkAUql1a813kMfj3c3+4DKq4xk2Rg1NrqhazcrpCRCobqZRoNhkfdzowTMa4lP0+3tantuiyVkcHZuotTdqEVq+lylMGVKw/s31nvhawyEe/pzofj/GPV2is/O2qHAyUCnbTZK1kNrHdBWhvrL+5sbWqEjlww/p+pduahegcuRIeyljXu37XPC1kNtF1XQWP97nekwh3te1BXFzTt333AK1kNth208ys625v3QbvPmzDCAn//q34ddMbM0jNgpMrJ2jWbGPOdTOEclBSXKUycTa8EKChhq/eI2qlF7jIs1N8i/Z/yyenukfmKe447g1PuS78G9+SvXjuSdFMo6yc/uGitwN2xMo2CTQrHOsY7x5xCEpal7Bugjp0BjwJp/Vq+WLkqWt24b9f9ctT1o46laoGO98uROt7la9Zdc2Dfzt/5Odfq1lsxqIZxk5ZXwspciA62uxvIapMXpTaS8gHbPQm2O3VYN3Z12X9AXf2c2xb103bShW1vaWwA0gpPCGH1dndc5McBp8+c/Ry4Rn/O2QVTssBwJt/U9lHytYxeFIQO9NjcF1Z6Xzy1N56kLbpvRLVh28d5nw2UG2WoBnhnR2vTSRqKKD5QmYqjdOxlmOb2MXpd8VjH+HtPL3HNS1LQr+QmEwFGLxGxKgEd4JaWA/vKfa9oqK/mA/sel7F2g+bcvgSu4w9y1b6S8Z5wd3vrP9y7ZGNcIi/OupkYhpTL8XRbAdtd4bvpgPxA9fx5zSDihbr69+aGvd/Ile2kwuvubH8t54QlpZyU4tpHU3cv8nMaRiAzb8pbM4IO2kbKfc/qm5sRchGu2nbUkOvc4EfyGZ6aR6loT4TlNEKaXBW96mRogFfplC8UyXtjUHmP0apgZvx9jE43qkv45JEngKpyCD+9c9cp0wr3Jjfd2i5dC+gAX81VXUsFBR3g6Qw38AxwZX6Ya7dDumZ2KnnjONpi1tuumWbAqrvndgvcwLW6bWXUea1UkgGB/CbD7TwH6urfcm27rvaWo6UCzilhgeFP8UVdzZj5AqiDnG4Bb1K6LCWzxBGqRnp3R2FFTkz9zUB1qY07iYwVkg/1uZz9kot0BR9xI1HLSnlKQxwIBJNS40FlPa1dvkDw+YGdwj5Bj7DYqLncQVWOOG/ypnQFbRtIDazMDGXbOeEQmbf79XwZsgAK6Ge57gDgWp8EameJVAugGiYsa2xrU8M3x5qTAdtlvTGInFNcU3b1vKYDe2tzXQZw0U5fXbZ+HpSjGOrqkYmyncxELLO85IywBLfP8ONgoUjBV3JtDE7psfIuoEkG3iHMDGSUHUvmZ+LuQ76ffpiEJkYZleZ7I6xQi23bF/V2d07TLZ9hmM8MUBm2pZmDbPRMo3D8YTudfeJpZAe4guk7rtJ2cn7t5He2SoJuAOXzPLf8nQcZ0U3r7fkR2PaZiUzHLed44HzfGsN2WSsscNHruzraXvJrvm8spJK91T1d7X/2e85qLHUHg/+XcyJYXOl9mg/KALiBvphLQxhllQw6jprTUeELg+6eKYJyQxGo4Gozz0HE1mTXVolRyrArv7DIctXWtERv97hin5hhHAB1dY8fZQRSeGmQW3S03vFo/RiNa9hO92xre5/t0uEiZxUXEbIHZH9n29KJ6nBqxG458MmDsRNTV0erHICvHcV2WQ9QnR2t751I24FS/MLBsF1PZ7t0P2/NCWFZqdTxugeCjv6CTqQyXVuusjI4k7uMBAgnKSkAhXPXT7p+BiEl/Zt09u/OIpwARjXZSNMdTNWRIBw+T//NGD1Ao5VHOMdk6o6XxYVyLS2pwPJm/wuXnwnSejnp+Wxjb/eD47l2GP1P9GX0V5HvbM/AETI5V/OoHaOPwMkhpPzyopNIKtEf6ytDGY7LjxDjb3905r0msMO5E23kYCDR2xNZXXZ16XBBpc5GLFbWO0UdLraDPlEkVx54TWwwKmGlUsnZugcKhkIPac5NPQOks0y4qTJtOR/luiGOSyJDGFi/qnJJR+3SQp3YICmkjP65GzdeyAkZlWEQTJBl8Ku9aZKTczOGmqh3zsnc75pUnMP5+O8Y+uWqmIGALXetHuAOJeKeb4YwwxSjDSKr1603wa0ZcO2Nx76f1Hd2KpumMcNkZNGbh+dO80LwT8DTA8NVl99hFYcauG1/GJ58nTtjjvuTjOgeiDLjWc+/jVZQII0F6WVC6c7iLGUSrkvihilk/o44ZKUUFxBY5jIjweV8lfs5ddZf9RlSOH+nXUV5HOJu/ikjv8GV3MttfvREV3A4kr934Ci+Iagz9xCO5LWOWvl0aFDqK0BWpjtn5cz5EbJi17bDttOB9/HxET6ahpQ0FmFZH8vNHJZta48UoFre1bgI+F8UqK7pKiepqARz2MUGxgkQh7xUqIKcz5LuntpSSu40bChySpOZDBp1bsHTvtvxXKk25zgy2FQtSXFJyiG69DIcDsdmLaA8FuvaRK1VmzHrqVAocjMzjL+C2utw2UeugJ8OJ14G6nZld0frShktHwiGBqVy9hhJnZ7zMwO7R21QXAyYv3p6/nvA/NaAAePDM4pBk47PnS0qnv27UDjyLeLkH4PqoGFQqu+L93T90JeI9GFQWDRzeySv4Mtgazl/KuOb5ALrpWDPG9uaG87VdYlARS0fXnkJ/zbmBdvNmDn7kUAocj0MpP+AN8B2Ik9w/r7enq7bs10jOV5A29wKg2Q5tM0XZUYG6ShBwY5PxHtv8mPe0LKt5TkhLJ/86i6N30YoMIih5qKcCXMZ4mkSJ67KWQtIndAFqbaokkz9y/uErT5XsVfM2QhBzk1JEpLxV1wFjdI+dWX2lZarmHlK0qvgnd/C79ptyzpStzFE8gvPHMWHl51Lzo08Ba7ZOqiD1XAhyUGdYp7ONQQCwTfGcHcWpl//bdFJ0v1UZJW2+eK8AhLc9sexG1EwZBWXzD15S+2dg6WYLI8MRTjxsjXrvtlcv+e7fnbykrlHXnJv7O6HhjnnK/D4zKroVac37t/1rE7HA4U1fwTb+aLA5TI2sN17oJ28OUw5noDHcStXR29padjnW7ybHEhL5hz5mS2xux4Z5pyS+M9etfbKsxvrd/9Gx3bQh47ym7BYugBaBzHkoCZ01hZM5+5EOlHxVM7dqZRIR7DTvkXN6dE/HdpASDp8wfmuOdDnUQTVF6btvKXILCUc95K55xN9hCZJk/WmkvESr4Upnn3EXT998P73jnfCUS64vbfu7jrofAPmSgS39YJGjTGDRtXI3XDcqaQeyEqAUuVqbg8qxAySxTteGlfjn1kyd9kwZDUA92/e9L2C6cVv+tVwocOtHoasBuDe2F3PwbVp3b3l3Bo2FgvUj/aWdzLguHjWnMXDkNUAPLAl9jWZTMAv280anqwG2q7u7t8WzSzVirMDdVqcE8IyTNPWdAe1tKNNRTFVG3E6EepyMly4r6UaUhcnnGUh8iHcZ9tVTooq1cRUPxnJqHcjPenu3paXf8vPVOS7VFPC+b4taN9vbWJY7ysstGU+IC9lKZo155EH7o1d7UflwCCg1SkoZdvGmBQ9kS0/nbzS2a2ULXdDQQJAQh/Y9eq4zjFj1tyazbV3jouIIvkFX/PJDdwGHerecbnFgeD1eoTFAyPYTtvFBTL9Dthu93i+m1cw7Vo/bDe9uOT5e8cgqzRCobBWfYGNwjkhLNMMxLUuTMgQLO9eJSVsnuVSnrpr5072EkL608XQAT9Qbpz8riA8syh9KsskDqGpJTzuXFX6HLYKiSD9Co4633dUFn97SUdDGEbQrAsUzsvvDkfyPutX5di2rUtYO0b7PHHEkobHWloVUZmuDeVqgY/v2T7eOTIeCAbHvTbNMMw/+WEX6LyfGe93ZUiCjgcBhMWGr5vUcTplkPm/wH7jdpFBFDzth+1C2Sydo2yv9J682842c0JYYLhWTSYdkhs+q4sQYgF1icOJl2IqhMFQJMgU8WQYsY+c0grLec8hLjV/JUjfb6hQ8VtOiIQKKKWDjuWot/R5AW8EmbeULtOKZp1Xd49/OYGsVPJYPcIiIy70Nsoqjf9tbLzY4ryv/HIu8P3TC8df3hkzf5FNckZ508EHsmqGc76T1TxRMJTwu+Mkk0mt+RloK7Gs0i9R2qx7zQXTZ7ybTaLCzZtut5hhePa+chEB5iqs4Luavou0qOe1Q6DPFhlucKiZXkrj3uWTd//kOjbmkotJnHAF4a4l5Op9oT43XRkmiUd+5jzS3GQ4xMWctMSmG+5guhP4rG8Upv+A8szKtgyR/MKOLbG7nvCzciwrpTXxD+VqHWWQuB16y1KaUf4l+flkxvbx79IVDIZvyepyBkaleCWsrDN8Qtk8n3ckmW0lE1phDWYgWJVdVVJt24UjBVlnE2aUcr9t58ccln6gjeAlGr8+3q0U1aLTS2wG7cqiyCW9PtDMiKOSE/Hp7A39kfAOww8+Rjq+KP09dax+BSDJdweoxQXZFiC/cPpNfleOTqeQbtBI6seMboyCna/ssys8SgImWbzjr1kdHyrs5YkeccGtfIhMJOTt60GQOfZlfnrPnQ7cLGjrO7LTBPrWA7X0qwk1HWN2rgjrj7oHAl/fc8wFEMXiwaRiksxNDvp3F+Yu4aS/xzNeZz5bLsOzDOIjZOCC6SFE5ny2C8qyKOuOZAbv87Ni1qzbYKaSCc+dIhiK9I7gCn5AUKO2b3E4lDtsGOSUd/+WndLJL2zMNqMsHWXj3vGSJDx2Zt2+bDvguYMwwxpG7UzTSbiXV1C4M/tlbFQr+4Gcb/SSt54L7nmLPBhcfHfFTUehGNq79dq2JSdCf+2pUVB6iSV40CBuaIM7Ke64hYIE1NwWvQAGu6/Jt2z3wrnM0CDvBqp4Kod4ZBqZvpgu6qSXkZ/blN0Co9TDhrwTJkTfPJiMoJeqV75lOufcDo3xpuzIISy3XfI1ET9ceoHO74Oh0J5hyOoIIObnBHFcbrU0CV58eHf2AjsYjmQ9yIF5tVLohvMKWrzMEaasVMB7pzN6hhIg1woaBVf6D9nPunCtfHWRvII92Q+acqs8zryTpNmSE8KCPvuOiprUkJ3xnq7z4elKT2RXW7V1rO8EohXHioyYKkulQIbfcjf9ccbmEPJrKlRBhjW4gaPgsj4o6mq2jlAx01KpxPfTf/f0dH0hy470ut8VAypPa30nKL63B5FVPhxzK0gGU6qDdCaL8d4RHGb0zJqwYBzRSvcMA8Or2Xe6DaaXO74Zc017hhKvWKRVN4b5nIeflWp19GBoa9b1RanW0jDDCOz0u18o9pTSPr9gulZgmtzGSq7OzqFLfLRURow4GRnkHT5bLV4WKuDRufvHXL+jf40gd++CMcaaRxm+lsvsj+lHb1dHcXaNOuD7ymAgWa0NAgxm9DFRsKwcOq39J5PSWf0jFSWnFXmvLnCVXs72N6AStDq6aQb+mv2vxDSdgRjIZUiMGdhSL9zEMF71YLtj9GxnZp22HPrODM1zvpETwnJUQv69ugezrVTOEvjZgqtMDrabj8Fwtp5wI9mdpTzOJhQ0YyR07/458Vqto/jpWusGKTN8V1jQKZbqdQonaFTmEEtx8gt4uVy6v+k5u+ML8rvytz+v0XLY2x46wDF6dmZbs7ej0FKqzDC2D53+0A4afTf7cvD3aJWDZU+SgAV6bdDcljPCgtHrLt2DdbQ1X7tmHMn7PXVgQo83ab9qUkGg1M2ykDGAyolkufiZDrgnpahrxOBYrc0nnMbg+0iiG0mdDhplgv8IbHSuoWLQbDX/B6+/s6xp56taxyek0QMJH69ZJg92Fgs1CWvb0IHZ0tmsRHoI7VkP2LattwCa0neytpzmeklG6Zs5I6zNtXfuDEXye3UOloz3hqAy1/l9kYFohYykP9q5YO5uLOFujOC6iJk758gZZfkJ7VNdJG7XVtkjj/x6hAWn971iuKbCEpTtpWvLvwHKc71KVOgGzII+3WwR9h1uW54XVss1cDAcZL2Nm2Vb79GzM816TgSUiS5JDlFDVirh2bUFYSC3qY9nT1jWEs1y7PMwaB6n14rp2zkjLInC6TO+r3vAtuaGO9ZescHvDRVNoJ4Ci7ibTAiq7gaquSv5rNYhDszvru4huJ/bhL4yakdKpZZqNoZ6vyvGSia03NTfBAqvhgv7D2UfNdcn3Wb6qEVEmdyeCwaXOV6PHQyEEls8ZJe1rdQiDSNLwmr10NH1BiNCdw0ZmJOJ6Z4bciDY4609JDUzH2S/yoDrztUxeiCnhGWYgR/oZm6Q2Te7O9t9ze2eilWnQCkZBrHBmxEGqAYjAM8m4eq1/MxkwjDUemdugEsIEkCo78tiwT8fGuOa5+t0JPiny++KSaWSnle6ty9bQVpSVuWgoKcXwVDniVgNX7NuA4NO5zmuJxAKeWqIqWSy1HvjZ8KTMuG6rhQZ4L7JoFFbI2g0EAzt8ma7+AyNc1pedmEHb2mJRn3JJ9/7xQDDQ6F6Lr18za9aG+u1FvB2tjUvu/TytQ/+5L66S3xzkepu4yRHSMR7CzUaQ0quufLzeuQ8YCqZCHn5be97TiN/am1TKS2cND0qGeJ2UKCni7qa9HWGte6cmYG3vJQJBoaQ13PKDWY9DqCLNcop29zAHGWEFOgEjRqBwHaP7cE7SYbCntYKwzmP8m470/ZCklkRllO4yCpgx3bdrbNbG/dfDKRF/CCt1WVXL+lsb/mzk3k9PfANaEQk8zMy6O9QJO/JB+/bfOEIjcEE6Uu9d6RQG/EdNM+L/eXWXM+0tKnNNWROfHkEJsROi9D3i7rqjI7HteKhoDH+zYupdHKgB0Nhb8okEfd8lzAQDPYOjkgXXMzRsh0zvAS+aQURmwFv8VCpVKLQe78It5McYAhhbdl0R8dlq6J3NfuwK60krYsuXnlKpGDaKXDcHq/HEYKflm1sVCbCkbwRe7+Qubk11IYZCL7tf7VkTyh0+enkyaZmJ2eFm2IaXsilGMtFrLp7UKfTC3xk2d+uBhddK6YH1M4/vPxOx/U1A6FhlrIIrbnF4e46jgMlWrYzAn/3oOrA9bUMjX6xk+QAw454ZjD0pWA44ss6IJmPurl+T+dla9aVew154JZ1ml4jMUcOONSMKDfN7BvDmOXlIispHjjpw+S3zS3Ogu7+bdDa4O/jU7HqjmHIQ+smA1F5x7PGfL1OZ7yWfafbkKc3GAXeHKZydO86Zn1HOTOVtUeS3OrhZ1quL/QL3++cj0hY0vcsmln6Qb9OIl0BIK3q5gN7k5etLrttTdnV40qbshoIbnXZVUt7nWU/3gvJRh3VFupZkPm/pYwQ4w6wlGT1aGOTjHFyct+rpUm8zSbkGLu2ati5C25bWjFezFtMj26659c8nHOG3jnNIYORzXXj42j24QWaAbfMQ2AztCPfA25z4hL2uYa1d768cnXZj1sa9n7Rr5NZyaTR3LBXRsN/5TPnnWfn5U/bBqPYC5QZf2eUtcjsxdDI5sigyVQy/sHuro6j/NgggzI2ogqyOdddAuN7lPt4I6kD7z2DPHrggDOHxwy1jjIACuv4gmkff+W2G5tHLrNmfA1lWSeT0w7O9RI0KsSRmnU7ZDCyrKRW0CigzQNhaao6+pYH2y3U7HMTS1gSD2yp/dJFF6/8Z3nXz+8TS/LqSDadBC9PIrnHiOskddeFkRxE83JujXlNQVBWj4Cy6sua6igf8rG928nsIxZ2j0qIqaRnknZS5op49mXSszOcdFf2vxHH+N3R7VTKc/S3GzSazNp2+gG39dnXF9fMdst25KIjjzmnFCmYdlJe4fRGMlUBnXi0CX/btnRHL9+D4yxr9E5hnHQG+TWQlXQBqTtHY7hk5Y5uozbQRCLuOco9EAzFN3sKGtWI1Pa4nIXrK8l3h7GdTjyUpxTRViqpu6XYhAeNAvblojuPGdsBnd1ae8WGBSAR98iMDFONr8KRvDHUhl70tZfGMLb6TIyYb0ksP538trFRrQlML0WKwHWcuWfAFM+oAXvJRDyk0ek8ZfVIpZJHeucNb0Gj4IZqKpOB6yWhH5gwwBkatvN05wwIy3PArekEjWY/wOgM5E7K7cEBt7MH3/6gzkYMbfB+sfQO6u7pzym3dt2GYlDIkp9aMuO5xnXXDg4ULyyaeUTB9OK3pxphBUORUSeIk8m458YQDIaSXhrDaFitggSTkWE7/QkfIo81t6gEhc5Gs5yEoQYzyUq6bKMFskLD0btz5vHuT0oj3XMoFOn2qFQ9u4QquymlPYN8zAKdOVXDDHhaJJ+I9+Z7b//egkZ1llEZhjkg4FZGBzTW764/sOedhsxHa1P9HiHE++Tr+t1vN6TTU8kcZg373m1ugPdB6V2YlUuYhvS98wuLlsyYVfqrqURY0MFezZXagNGr1e/rlem8hguw7HnPB8nTLS1qS6403wSYQT46KAEfKMrRr0kIvaBRw/QQqb3BBJVwEJazJBdonDMxOLsp2F73ztnW7G23PqgVXuAxThD6RanGOQfYTg7qJXMWzC6dv6hUhkvJ3XvmHHl0aXHJ3DmDBpgy1x3955HKnFVcFIzc/Cf3b/lcyRELLnSXLUx6QCN5cZTGoLVEJZCDoFG4nCFzJK3Hf4D8sbWNWOk00MBq00xzsBuYbiy7Rz++mKdzfdRb4GOBpqrzFjSa0FhyFRhmBYMQmulWvNw5o1pJMY1hQjPGQZLM1kgrPdy0AXBHExDXAUoZl+6idP/g0WdjEEMNvV0d33Dr7ZuR/MI2bcJK497Y3Q/PmjN/+vTikhcmO2FRZvxtlM6rG6fzuv9XLAbMX+079lTyl45OuTt237RZkRkkH9q1bQS3Y/Qsj1DmY/U6Hc2+0+krEw9Bo+tNbmmk9w0EhgxGtn4+r7c92G6epu08BI3SsG1ZnpdRDRtwm+FXDzd2AUHdqLIWl61f1NnWckZ+4fSbfSMsV+Z1PfST+1aUzlt4Chx8/2QlLDb6dkq60de+B41mBljuOOYU8mpXt7obaKgNNxgpCQTJip0jL+VjzBh1RAW5rTURDb1ud/Zl0kyixzxFauvtG2iYQ1SddlJFRrPeCEI3G66nOEHNgNvRpw2cfUEzpkDSA+3DMqtEZ0fLC3J+Fjy4zb4SVh9x1d758s9/9tMjZs9b+P5pM2Ztm1RsJW+HM9YwCjlodiT2mt+XnO4U244+mbzVGx+wTdn8UIi8b4ztuMZaq2bbll6OIw87EAvNFC+eYno0I7WHc325xp0zdxK/K3vbcd1lVFmrOqE5kLMsFnhniK1kwfTin/R0tpdMK5r5DNhq2Lvvpl8dbUvtnXKu6EQ502+lkuU93Z1f1Fmw7JWgInkFHaFI/pNmMFRnMPaUvMM5SmPQ7LzGO34XoSeVOu6vC5eTxkRC5auXI4okrWPz88iCN1/S7ty25T1ZoZy3hIaUdeCjrWtnRvd6UCa6qm6Ia21pBI3KdCvQFrO3nXaq7OzjBHVTI48WWQ+DfAI+j2coLC4z2MoqCwbDN8Hry0OhyPVyiZn7vpUTwspwFeVk2Q3yIckLXJBPpZKJVYne7g/Fe3sKdNPWOD5ykAMhdQWDobfg9YsgQZ+FBvYClH5nNpHEFH4zo2TuQyNxP1VJlgUZcdNtD+7RqNcTrSw0wjPfy5OpvuqU8VbzwsF/X962bzEtmTtobKLDNZZRww6Coch/Q5mPSsvxkVLyjNDY6r3sCwj18yScczoZzZYjf2ZDmbLe3w4c6H0j1+3Y54WyDpmfDefl/zQYjswezk5j2ZJ52ADWnQ/63YySOcNco3Pd47iWjuwJh+1I244OVUJjthVQkyPuqDRtRsnMzL2MwUN7Uc43uuFBHfKOsry5Jz/LeL//2H5sgT1eyAuA85UChS8FFl/KOV8MBDaXS59ZkFC6j4LBWmRksxwdgFR2Q/n2gxHkKLtf3mGAY/ge/3TQ59qiFfOhvP8HqqpU7nptOU0iDiPK6alY9UsEgUBMLGEhRlJW5SsClDzLRVrxql1+GsD/+ie7tmoPWgiBcAd2NMFBV1ZrQCI/z4UwpfsnH4zSly0ijkGyQiAGuchogoODQLTcsIX4IbxcT9zEe9LHFYI9CKp3lYhVW2glBAJdwoM/SkTL80FR/VZQenp65tLZV5F8zRbkVlFXg5WCQKDCmgQjRLRiEaPseWCkUucepNy9mlrgAp4lYjVPoYUQiJGBc1gTaexoxefhSQbyqTuBhqOs9gJjLUKyQiBQYU0KBKIVBqf0ViCojTJcgbluuEXIoyah54tYVRythECMw0PBOawcjwjR8hmCsieApE5OL7HhKve6uFYI+v1UrBorAIFAhTUJRoNoxWng+f2OUWcjTFdZxcEP/2iytubPaCEEAglrMriAcm7wekrFDUTd/eMqLYxN2MtAWh8DVdWKVkIgkLAOOoyyypmU8N8zSk+WKWFkOmPLcQNvAfL6JpCVjVZCIJCwDjqCZeWfZoL8t0yAllLeHxAW53GDsk+kYjXPoYUQCCSsyeAChjilmzinl0kH0Oxfjf6cIPRfQFW1o5UQCH1gHJY2WZWfACQlU4dcRqhQCWksMKtBRLlJ+EdEXQ2SFQKBCusgM/3ajSah7Abw/K6Tm5kK0reh6V5B+JlW7LYdaCUEAhXWQYdRVnmMQdnfieAOWVHqMj+7jVO2yIrVIFkhEKiwDrr7Z9pC3CCocZ1kesqcTYANwZvg6WwRq8JEewgEEtakUFXLhRCPEkbnmYITWyorQaULeDdQ15dTseokWgmByC2GLM2h0XIqYpjeJIOowkwIcPXolVxZhavttuC9JpuKs3ltDaoqBOKgKSwnTW8KiapSBiecAyT1c0JpWC2rkYn2hEq0dwt8dh2QVQqbEAJxEBWWnKeBtzm4OPxwNQpbu3G+QdnPQVWtYO4dQOGoqn9YhHxaxKrfwqaDQByEvjn4jVSsxrIFLzhs3b9oxa2CGrtBaq5Ip4EBspKra1bB43gkKwRiMrmERN39mkk87Gc2ZY0QrQBPj14EBFUHZB2mjGZuuvYgPK6ya6s6sbkgEJOQsAByx+Z3DgcDBKIVK4CsHqaCz1Nr/9xQBVuI7eADXsBra17HZoJATFKX0EU+jVbSQ7ngUL5jgaz+Ai+fB2U1L11YJniXQfh5oLJOQLJCIKaAwuKgLgwilsLLNw49RVW+0Bb0bkrJWVZ6M3oh5Bbv0gu8BqjsR6IWY6oQiEkpNEZKkWyUVd5u11ZtOIRcvwWc0h9zwc9Ns7Ql81UxQQxBbwPaut6K1eA8FQIx1RSWo7LI/7Gy8kXgFk3puSxQVEtBPP3IEuQsp8AZni4l90NBK1J1NU3YFBCIKayw2NqNeQZlT1tCrBB1NVMqJksGfQrC3w9s/CMh6KnpzR9YX1nF/aCovmrFbmvAJoBAHAKE5Xb8b3AhgiJWfeOUKEy0IgxP5zFKq+REOqeZW2rJjAribnh5QypWjUSFQBxqhGVGNwagy+8GlbUeVNYvJrGiWgBP5UCuXwSyMiVJ2VTNTREgLYsJ/l1O2W12bVUbVjkCcYgSlusaHi+osR3UySpQJvdNmgtfW55vUvov8PJGm5ClytETMj0xJZZa98ekiroGrvthuG7cqBSBOBwISyIQrbgInn4KauVuLsiXRazqoNz2D0TLI6CUTuOcVzDGPm0QrlK8cBWSwOWeylAg+1G4xusNyl4+nNdDIhCHLWG5imYlkMT98P0m+NUl4G49kWtCCJaVU0vQYoOQD8OfX7QE+Zja4E9GTLmxU05cugA1RW8C4noQ3D7c8w+BONwJy1VaK+Dp9+ByFYDrtVMQcS0c4hErVt3lk5sn2Wg6ENEJcOxzDSIutQmdJ/NPye3dqQB+ZEBSkq+I6ILP7oYC3ANq6k3c8h2BQMIajrQK4WkTkNZF6gAq+Qp9GUhmMxzrOVBh74Kr1pUSII6GIREZcsAEN0AchaV6gt8shGOcYjL6Cfj4tBQnRVQuGOLquO5VOqIqwEgTuICb4K8HKBVvJGtrcFNSBAIJa2ywtRsXC8JuDjBxAZCMJBPppRGbOs9ASG2mIO3wUUKqIyAk+X4I3p9uEVIk7+RxpZRktLkTI8XgQ7kBqeGewxbEAiL8A/y9BX7zJBxgv6jDbKgIBBKWR5jR8mkgcz5pEnolkMpHgFRU9LzpToSnJRKnTli9JKn0a5lkynBJjgmVd+otUF9PwfcfAwX3AhxjH7h6FlYTAoHwhbAGHCxaKYVUieD2IoOyY4FpjgLVNA/+llHzRfCVNnDlEsBkjTZlu+Dv3VzwnYyyfUBUbakYphxGIBATRFgIBAKRS+BGqggEAgkLgUAgkLAQCAQSFgKBQCBhIRAIBBIWAoFAwkIgEAgkLAQCgUDCQiAQSFgIBAKBhIVAIBBIWAgEAgkLgUAgkLAQCAQCCQuBQCBhIRAIBBIWAoFAjAP/L8AAk9f5ZFWN81oAAAAASUVORK5CYII='

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const id = event.context.params.id;

    switch (method) {
      case "GET":
        const jobOperations = await getJobOperationsById({ uniqID: id });
        if (!jobOperations || jobOperations.length === 0) {
          setResponseStatus(event, 404);
          return { error: "No data found for the given ID." };
        }
        // Generate HTML content
        let htmlContent = `
        <body style="font-family: Arial; max-width: 1024px; margin: 0 auto;">
          <div style="display: flex; justify-content: space-between;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                <img style="width:200px; height: 100px;" src="data:image/png;base64,${base64Image}" alt="Grimm Avatar" />
                <h3 style="margin: 0; padding-left:10px;padding-top: 15px; font-size:20px;">Engineering Changes</h3>
            </div>
            <div style="width: 30%; margin-top:30px">
              <h4 style="margin: 0;">
                <strong>#:</strong> <span style="font-size: 14px;">${jobOperations[0]["uniqueID"]}</span>
              </h4>
              <h4 style="margin: 0;">
              Date: <span style="font-size: 14px;">${jobOperations[0]["ENGDATEAPPROVED"] ? format(jobOperations[0]["ORIGINATORDATE"], 'MM/dd/yyyy') : ''}</span>
              </h4>
              <h4 style="margin: 0;">
                <strong>By:</strong> <span style="font-size: 14px;">${jobOperations[0]["SIGNATURE"]}</span>
              </h4>
            </div>


         
          </div>`;

        // Iterate through operations
        jobOperations.forEach((operation, index) => {
          htmlContent += `
       
          <div style="display: flex; justify-content: space-between; margin-top:40px; border-top: 2px solid #000;">
            <div style="width: 50%; margin-top:40px; ">
              <p style=" margin-bottom:4px;"> <strong>Description:</strong>  <br/>
              
              <span style="font-size: 12px;">${jobOperations[0]["DESCRIPTION"]}</span>
              
            </div>
            <div style="width: 50%; margin-top:40px;">
              <p style="margin-top: 12px; margin-bottom: 4px;">Reason for Change: <br/>
              
              <span style="font-size: 12px;">${jobOperations[0]["REASONFORCHANGE"]}</span>
          
            </div>
          </div>


          <div style="display: flex; justify-content: space-between; margin-top: 40px;">
            <div style="width: 50% padding-right:20px;">
              <p style="margin-top: 12px; margin-bottom:4px;">Issue:<br/>
                 <span style="font-size: 12px;">${jobOperations[0]["ISSUE"]}</span>
            
            </div>
            <div style="width: 50%;">
              <p style="margin-top: 12px;">Solution:<br/>
                 <span style="font-size: 12px;">${jobOperations[0]["SOLUTION"]}</span>
            </div>
          </div>



          <div style="margin-top: 40px;">
            <h4 style="margin: 4px;"font-size: 18px; > Parts Affected:<br/></h4>
             <span style="font-size: 12px;">${jobOperations[0]["PARTS"]}</span>
         
            </div>

               <div style="margin-top: 40px;">

       <p style="margin-top: 12px; margin-bottom:4px;"> Product Affected:<br/>
             <span style="font-size: 12px;">${jobOperations[0]["ProductsDetails"]}</span>
         
            </div>

          <div style="margin-top: 40px;">
           <p style="margin-top: 12px; margin-bottom:4px;">Equipment Affected:<br/>
             <span style="font-size: 12px;">${jobOperations[0]["EQUIPMENT"]}</span>
         
            </div>



        <table style="margin-top: 40px; width: 100%; text-align: left;">
    <thead>
        <tr>
            <th></th>
            <th>Employee</th>
            <th>Date</th>
            <th>Approval</th>
            <th>Comment</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><span style="font-size: 12px;>Originator</span></td>
            <td><span style="font-size: 12px;">${jobOperations[0]["ORIGINATOR"]}</span></td>
            <td><span style="font-size: 12px;">${jobOperations[0]["ORIGINATORDATE"]}</span></td>
            <td><span style="font-size: 12px;">${jobOperations[0]["ENGAPPROVAL"] }</span></td>
            <td><span style="font-size: 12px;">${jobOperations[0]["ENGCOMMENTS"] }</span></td>
        </tr>
        <tr>
            <td><span style="font-size: 12px;>Engineering</span></td>
            <td><span style="font-size: 12px;">${jobOperations[0]["ENGAPPROVER"]}</span></td>
            <td><span style="font-size: 12px;">${jobOperations[0]["ENGDATEAPPROVED"] ? format(jobOperations[0]["ENGDATEAPPROVED"], 'MM/dd/yyyy') : ''}</span></td>
            <td><span style="font-size: 12px;">${jobOperations[0]["ENGAPPROVAL"] }</span></td>
            <td><span style="font-size: 12px;">${jobOperations[0]["ENGCOMMENTS"] }</span></td>
        </tr>
        <tr>
            <td><span style="font-size: 12px;>Marketing</span></td>
            <td><span style="font-size: 12px;">${jobOperations[0]["MARAPPROVER"]}</span></td>
            <td><span style="font-size: 12px;">${jobOperations[0]["MARDATEAPPROVED"] ? format(jobOperations[0]["MARDATEAPPROVED"], 'MM/dd/yyyy') : ''}</span></td>
            <td><span style="font-size: 12px;">${jobOperations[0]["MARAPPROVAL"] }</span></td>
            <td><span style="font-size: 12px;">${jobOperations[0]["MARCOMMENTS"] }</span></td>
        </tr>
        <tr>
            <td><span style="font-size: 12px;>Manufacturing</span></td>
            <td><span style="font-size: 12px;">${jobOperations[0]["MANAPPROVER"]}</span></td>
            <td><span style="font-size: 12px;">${jobOperations[0]["MANDATEAPPROVED"] ? format(jobOperations[0]["MANDATEAPPROVED"], 'MM/dd/yyyy') : ''}</span></td>
            <td><span style="font-size: 12px;">${jobOperations[0]["MANAPPROVAL"] }</span></td>
            <td><span style="font-size: 12px;">${jobOperations[0]["MANCOMMENTS"] }</span></td>
        </tr>
    </tbody>
</table>
            </div>`;
        });

        // Launch Puppeteer with a custom timeout
        const browser = await puppeteer.launch({
          headless: true,
          timeout: 30000, // Timeout for browser launch
          args: ['--no-sandbox', '--disable-setuid-sandbox'], // For optimization
        });

        const page = await browser.newPage();
        const pdfOptions = {
          path: "Operation.pdf",
          format: "letter",
          margin: {
            top: "40px",
            bottom: "40px",
            left: "40px",
            right: "40px",
          },
        };

        // Set content with a 30s timeout
        await page.setContent(htmlContent, { waitUntil: "networkidle2", timeout: 30000 });
        const pdfBuffer = await page.pdf(pdfOptions);
        await browser.close();

        // Set headers and return the PDF buffer
        setHeaders(event, {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="View Operation.pdf"',
          "Page-Size": "Letter",
        });
        return pdfBuffer;

      default:
        setResponseStatus(event, 405);
        return { error: "Method Not Allowed" };
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
