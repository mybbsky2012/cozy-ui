The Page components enables to make layout that react well to keyboard appearing/disappearing.

In the example below, the Button will appear at the bottom of the screen even if the PageContent
does not takes all the space (the content grows to fill all the page). When the keyboard is
shown, the Page real estate shrink and the Button will try to appear above the keyboard if it
has enough space.

```jsx static
<PageLayout>
  <PageContent>Hello world !</PageContent>
  <PageFooter><Button>Click me !</Button></PageFooter>
</PageLayout>
```