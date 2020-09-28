# read in txt file
library(striprtf)
library(tidyverse)
setwd('./Desktop/climate')


dat_ex[0]
dat <- read_rtf('noaa_data.rtf')

# extract all characters that arent whitespace
dat_ex <- as_vector(str_extract_all(dat, '[^\\s]+'))


# convert to df
df = as.data.frame(matrix(dat_ex, ncol=6, byrow = TRUE), stringAsFactors=FALSE)
colnames(df) = c('YEAR', 'MONTH', 'DAY', 'YEAR2', 'PPM', 'NUM')
df = as_tibble(df)

write_csv(df, 'noaa_data.csv')
df$temp <- sprintf("%02d", as.numeric(df$MONTH))
df$temp2 <- sprintf("%02d", as.numeric(df$DAY))


df$MD <- paste("'", df$MD, "'", sep='')


df$temp <- NULL
df$temp2 <- NULL
suh <- "'"

months = c('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December')
num = c(1:12)

suh <- data.frame(num=1:12,months=I(months))
colnames(df) = c('Year', 'Month', 'Day', 'PPM', 'MD')

df$MD = suh$months[match(df$MONTH, suh$num)]

  top3df$id = qw$id[match(top3df$url,qw$link)]

df$MD<- paste(df$MD, df$DAY, sep='')
df$MD <- NULL
suh <- data_frame()

df$YEAR2 <- NULL
df$NUM <- NULL
class(df$MD)

               