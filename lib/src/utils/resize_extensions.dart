import 'package:portfolio/src/constants/breakpoints.dart';

extension DoubleX on double {
  double sizeScaled(
    double screenWidth, {
    required double minSize,
  }) {
    const minBP = Breakpoint.mobile;
    const maxBP = Breakpoint.desktop;
    final maxSize = this;
    double scaledSize;

    if (screenWidth <= minBP) {
      // Para pantallas menores al breakpoint mínimo
      scaledSize = minSize;
    } else if (screenWidth >= maxBP) {
      // Para pantallas mayores al breakpoint máximo
      scaledSize = maxSize;
    } else {
      // Para pantallas entre los breakpoints
      final proportion = (screenWidth - minBP) / (maxBP - minBP);
      final calculatedResize = minSize + (maxSize - minSize) * proportion;
      scaledSize = calculatedResize.clamp(minSize, maxSize);
    }

    return scaledSize;
  }
}
