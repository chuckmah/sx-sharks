# Sx-sharks

for any information @chuckmah in [SX discord](https://discord.com/invite/sxnetwork)

## db dump

sudo pg_dump -U postgres -h localhost -F c -b -v -f sxsharks.dump postgres

## db restore

sudo pg_restore -U postgres -h localhost -d postgres -v sxsharks.dump
