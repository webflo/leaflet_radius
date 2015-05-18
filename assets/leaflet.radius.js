(function ($) {

  L.Control.Radius = L.Control.extend({
    options: {
        position: 'topright'
    },

    onAdd: function (map) {
      var plugin = this;
      this._map = map;
      this._map.radiusFitBounds = true;

      var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      var select = L.DomUtil.create('select', 'leaflet-radius-select', container);

      var el = document.createElement('option');
      el.text = 'Umkreis wählen';
      el.value = 0;
      select.appendChild(el);

      $.each([5, 10, 15, 50, 75, 100], function (index, value) {
        var el = document.createElement('option');
        el.text = value + ' km';
        el.value = value;
        select.appendChild(el);
      });

      var $select = $(select);

      $select.change(function () {
        if (this.value == 0) {
          plugin.removeCircle();
        }
        else {
          plugin.createCircle(map.getCenter(), this.value * 1000, true);
        }
      });

      this._map.on('viewreset', function (e) {
        var value = $select.val();
        if (value == 0) {
          plugin.removeCircle();
        }
        else {
          plugin.createCircle(map.getCenter(), value * 1000, true);
        }
      });

      return container;
    },

    createCircle: function (latLng, meters, fitBounds) {
      if (!this.circle) {
          this.circle = L.circle(latLng, meters, {
              color: 'red',
              fillColor: '#FF0000',
              fillOpacity: 0.2
          }).addTo(this._map);
      }
      else {
          this._map.addLayer(this.circle);
          this.circle.setLatLng(latLng);
          this.circle.setRadius(meters);
          this.circle.redraw();
      }
      if (fitBounds == true) {
        this._map.fitBounds(this.circle.getBounds());
      }
    },

    removeCircle: function () {
      if (this.circle) {
        this._map.removeLayer(this.circle);
      }
    }
  });

  $(document).on('drupal_leaflet.map.plugin.radius', function (e, settings, lMap) {
    if (settings.plugins.radius) {
      var radius = new L.Control.Radius();
      lMap.addControl(radius);

      /*
        var container = lMap.getContainer();
        var height = $(container).css('height');

        // Create and attach zoomfs control.
        var zoomFS = new L.Control.ZoomFS();
        lMap.addControl(zoomFS);

        lMap.on('enterFullscreen', function () {
            // Make sure we are above drupal navbar elements (z-index 502).
            $(container).css('z-index', 600);
        });
        lMap.on('exitFullscreen', function () {
            // Restore height on exit.
            $(container).css('height', height);
        });
      */
    }
  });
})(jQuery);
