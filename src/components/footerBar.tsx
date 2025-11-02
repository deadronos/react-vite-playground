import React from 'react';
import { Box, Card, Flex, Grid } from '@radix-ui/themes';
import { widthPropDefs } from '@radix-ui/themes/props';

function FooterBar(props?: React.HTMLProps<HTMLDivElement>) {

  return (
    <div {...props}>
      <Flex>
        <Grid columns="3" gap="3" width="100%">
          <Card>
            <Box className="footerColumn" gridColumn="1">1</Box>
          </Card>
          <Card>
            <Box className="footerColumn" gridColumn="2">2</Box>
          </Card>
          <Card>
            <Box className="footerColumn" gridColumn="3">3</Box>
          </Card>
        </Grid>
      </Flex>
    </div>
  );
}

export default FooterBar;
